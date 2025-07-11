import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
from models import BookingMetric, SpaceAnalytic, RevenueAnalytic, PredictiveAnalytic, db
import json

class PredictiveAnalyticsService:
    """Service for generating predictive analytics using machine learning"""
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
    
    def prepare_booking_data(self, days_back=90):
        """Prepare booking data for machine learning models"""
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days_back)
        
        # Fetch booking metrics
        metrics = BookingMetric.query.filter(
            BookingMetric.date >= start_date,
            BookingMetric.date <= end_date
        ).all()
        
        if not metrics:
            return pd.DataFrame()
        
        # Convert to DataFrame
        data = []
        for metric in metrics:
            data.append({
                'date': metric.date,
                'space_id': metric.space_id,
                'total_bookings': metric.total_bookings,
                'successful_bookings': metric.successful_bookings,
                'cancelled_bookings': metric.cancelled_bookings,
                'total_revenue': metric.total_revenue,
                'occupancy_rate': metric.occupancy_rate,
                'day_of_week': metric.date.weekday(),
                'month': metric.date.month,
                'day_of_month': metric.date.day
            })
        
        df = pd.DataFrame(data)
        
        # Add temporal features
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
        df['is_month_start'] = (df['day_of_month'] <= 7).astype(int)
        df['is_month_end'] = (df['day_of_month'] >= 24).astype(int)
        
        return df
    
    def train_demand_forecasting_model(self, space_id=None):
        """Train a model to forecast booking demand"""
        df = self.prepare_booking_data()
        
        if df.empty:
            return None
        
        if space_id:
            df = df[df['space_id'] == space_id]
        
        if len(df) < 10:  # Need minimum data points
            return None
        
        # Prepare features and target
        feature_columns = [
            'day_of_week', 'month', 'is_weekend', 
            'is_month_start', 'is_month_end'
        ]
        
        X = df[feature_columns]
        y = df['total_bookings']
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_scaled, y)
        
        # Store model and scaler
        model_key = f"demand_{space_id}" if space_id else "demand_global"
        self.models[model_key] = model
        self.scalers[model_key] = scaler
        
        return {
            'model_type': 'demand_forecast',
            'space_id': space_id,
            'features': feature_columns,
            'training_samples': len(df),
            'model_score': model.score(X_scaled, y)
        }
    
    def predict_demand(self, prediction_date, space_id=None):
        """Predict booking demand for a specific date"""
        model_key = f"demand_{space_id}" if space_id else "demand_global"
        
        if model_key not in self.models:
            # Train model if not exists
            self.train_demand_forecasting_model(space_id)
        
        if model_key not in self.models:
            return None
        
        model = self.models[model_key]
        scaler = self.scalers[model_key]
        
        # Prepare features for prediction
        features = [
            prediction_date.weekday(),  # day_of_week
            prediction_date.month,      # month
            1 if prediction_date.weekday() in [5, 6] else 0,  # is_weekend
            1 if prediction_date.day <= 7 else 0,  # is_month_start
            1 if prediction_date.day >= 24 else 0  # is_month_end
        ]
        
        features_scaled = scaler.transform([features])
        prediction = model.predict(features_scaled)[0]
        
        # Calculate confidence based on model variance
        confidence = min(0.95, max(0.5, model.score(
            scaler.transform([[0, 1, 0, 0, 0]]), [1]
        )))
        
        return {
            'prediction_date': prediction_date,
            'predicted_value': max(0, prediction),
            'confidence_score': confidence,
            'model_type': 'demand_forecast',
            'space_id': space_id
        }
    
    def train_revenue_forecasting_model(self):
        """Train a model to forecast revenue"""
        df = self.prepare_booking_data()
        
        if df.empty:
            return None
        
        # Aggregate by date for revenue forecasting
        revenue_df = df.groupby('date').agg({
            'total_revenue': 'sum',
            'total_bookings': 'sum',
            'successful_bookings': 'sum'
        }).reset_index()
        
        if len(revenue_df) < 10:
            return None
        
        # Add temporal features
        revenue_df['day_of_week'] = revenue_df['date'].apply(lambda x: x.weekday())
        revenue_df['month'] = revenue_df['date'].apply(lambda x: x.month)
        revenue_df['is_weekend'] = revenue_df['day_of_week'].isin([5, 6]).astype(int)
        
        # Prepare features and target
        feature_columns = ['day_of_week', 'month', 'is_weekend', 'total_bookings']
        X = revenue_df[feature_columns]
        y = revenue_df['total_revenue']
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_scaled, y)
        
        # Store model and scaler
        self.models['revenue_forecast'] = model
        self.scalers['revenue_forecast'] = scaler
        
        return {
            'model_type': 'revenue_forecast',
            'features': feature_columns,
            'training_samples': len(revenue_df),
            'model_score': model.score(X_scaled, y)
        }
    
    def predict_revenue(self, prediction_date, estimated_bookings=None):
        """Predict revenue for a specific date"""
        if 'revenue_forecast' not in self.models:
            self.train_revenue_forecasting_model()
        
        if 'revenue_forecast' not in self.models:
            return None
        
        model = self.models['revenue_forecast']
        scaler = self.scalers['revenue_forecast']
        
        # Use estimated bookings or predict based on historical average
        if estimated_bookings is None:
            # Get historical average for similar days
            df = self.prepare_booking_data()
            similar_days = df[df['day_of_week'] == prediction_date.weekday()]
            estimated_bookings = similar_days['total_bookings'].mean() if not similar_days.empty else 10
        
        # Prepare features for prediction
        features = [
            prediction_date.weekday(),  # day_of_week
            prediction_date.month,      # month
            1 if prediction_date.weekday() in [5, 6] else 0,  # is_weekend
            estimated_bookings  # total_bookings
        ]
        
        features_scaled = scaler.transform([features])
        prediction = model.predict(features_scaled)[0]
        
        return {
            'prediction_date': prediction_date,
            'predicted_value': max(0, prediction),
            'confidence_score': 0.8,  # Static confidence for now
            'model_type': 'revenue_forecast'
        }
    
    def save_predictions_to_db(self, predictions):
        """Save predictions to database"""
        for pred in predictions:
            prediction = PredictiveAnalytic(
                model_type=pred['model_type'],
                prediction_date=pred['prediction_date'],
                predicted_value=pred['predicted_value'],
                confidence_score=pred.get('confidence_score', 0.5),
                space_id=pred.get('space_id'),
                model_version='1.0',
                features_used=json.dumps(pred.get('features', [])),
                training_accuracy=pred.get('model_score', 0.0)
            )
            db.session.add(prediction)
        
        db.session.commit()
    
    def generate_forecasts(self, days_ahead=7):
        """Generate forecasts for the next N days"""
        predictions = []
        base_date = datetime.now().date()
        
        # Generate demand forecasts
        for i in range(1, days_ahead + 1):
            prediction_date = base_date + timedelta(days=i)
            
            # Global demand forecast
            demand_pred = self.predict_demand(prediction_date)
            if demand_pred:
                predictions.append(demand_pred)
            
            # Revenue forecast
            revenue_pred = self.predict_revenue(prediction_date)
            if revenue_pred:
                predictions.append(revenue_pred)
        
        # Save to database
        if predictions:
            self.save_predictions_to_db(predictions)
        
        return predictions
