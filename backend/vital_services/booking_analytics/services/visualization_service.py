import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import json
from datetime import datetime, timedelta
from models import BookingMetric, SpaceAnalytic, RevenueAnalytic, UserAnalytic

class VisualizationService:
    """Service for generating data visualizations and charts"""
    
    def create_booking_trends_chart(self, start_date, end_date, space_id=None):
        """Create a line chart showing booking trends over time"""
        query = BookingMetric.query.filter(
            BookingMetric.date >= start_date,
            BookingMetric.date <= end_date
        )
        
        if space_id:
            query = query.filter(BookingMetric.space_id == space_id)
        
        metrics = query.order_by(BookingMetric.date).all()
        
        if not metrics:
            return None
        
        # Aggregate by date
        df = pd.DataFrame([{
            'date': m.date,
            'total_bookings': m.total_bookings,
            'successful_bookings': m.successful_bookings,
            'cancelled_bookings': m.cancelled_bookings
        } for m in metrics])
        
        df_grouped = df.groupby('date').sum().reset_index()
        
        fig = go.Figure()
        
        fig.add_trace(go.Scatter(
            x=df_grouped['date'],
            y=df_grouped['total_bookings'],
            mode='lines+markers',
            name='Total Bookings',
            line=dict(color='blue')
        ))
        
        fig.add_trace(go.Scatter(
            x=df_grouped['date'],
            y=df_grouped['successful_bookings'],
            mode='lines+markers',
            name='Successful Bookings',
            line=dict(color='green')
        ))
        
        fig.add_trace(go.Scatter(
            x=df_grouped['date'],
            y=df_grouped['cancelled_bookings'],
            mode='lines+markers',
            name='Cancelled Bookings',
            line=dict(color='red')
        ))
        
        fig.update_layout(
            title='Booking Trends Over Time',
            xaxis_title='Date',
            yaxis_title='Number of Bookings',
            hovermode='x unified'
        )
        
        return fig.to_json()
    
    def create_revenue_chart(self, start_date, end_date):
        """Create a revenue chart with multiple metrics"""
        metrics = RevenueAnalytic.query.filter(
            RevenueAnalytic.date >= start_date,
            RevenueAnalytic.date <= end_date
        ).order_by(RevenueAnalytic.date).all()
        
        if not metrics:
            return None
        
        dates = [m.date for m in metrics]
        gross_revenue = [m.gross_revenue for m in metrics]
        net_revenue = [m.net_revenue for m in metrics]
        refunds = [m.refunds_amount for m in metrics]
        
        fig = make_subplots(
            rows=2, cols=1,
            subplot_titles=('Revenue Trends', 'Payment Methods Breakdown'),
            specs=[[{"secondary_y": True}], [{"type": "pie"}]]
        )
        
        # Revenue trends
        fig.add_trace(
            go.Scatter(x=dates, y=gross_revenue, name='Gross Revenue', line=dict(color='green')),
            row=1, col=1
        )
        
        fig.add_trace(
            go.Scatter(x=dates, y=net_revenue, name='Net Revenue', line=dict(color='blue')),
            row=1, col=1
        )
        
        fig.add_trace(
            go.Scatter(x=dates, y=refunds, name='Refunds', line=dict(color='red')),
            row=1, col=1
        )
        
        # Payment methods pie chart (using latest data)
        if metrics:
            latest = metrics[-1]
            payment_methods = ['Card', 'Digital Wallet', 'Bank Transfer']
            payment_values = [
                latest.card_payments,
                latest.digital_wallet_payments,
                latest.bank_transfer_payments
            ]
            
            fig.add_trace(
                go.Pie(labels=payment_methods, values=payment_values, name="Payment Methods"),
                row=2, col=1
            )
        
        fig.update_layout(
            title='Revenue Analytics Dashboard',
            height=800
        )
        
        return fig.to_json()
    
    def create_occupancy_heatmap(self, start_date, end_date):
        """Create a heatmap showing occupancy rates by space and time"""
        metrics = SpaceAnalytic.query.filter(
            SpaceAnalytic.date >= start_date,
            SpaceAnalytic.date <= end_date
        ).all()
        
        if not metrics:
            return None
        
        # Create pivot table for heatmap
        df = pd.DataFrame([{
            'space_id': m.space_id,
            'date': m.date,
            'occupancy_rate': m.occupancy_rate
        } for m in metrics])
        
        pivot_table = df.pivot_table(
            values='occupancy_rate',
            index='space_id',
            columns='date',
            aggfunc='mean'
        )
        
        fig = go.Figure(data=go.Heatmap(
            z=pivot_table.values,
            x=pivot_table.columns,
            y=pivot_table.index,
            colorscale='RdYlGn',
            colorbar=dict(title='Occupancy Rate %')
        ))
        
        fig.update_layout(
            title='Space Occupancy Heatmap',
            xaxis_title='Date',
            yaxis_title='Space ID'
        )
        
        return fig.to_json()
    
    def create_user_behavior_chart(self, start_date, end_date, limit=20):
        """Create charts showing user behavior patterns"""
        metrics = UserAnalytic.query.filter(
            UserAnalytic.date >= start_date,
            UserAnalytic.date <= end_date
        ).all()
        
        if not metrics:
            return None
        
        # Aggregate user data
        user_data = {}
        for m in metrics:
            if m.user_id not in user_data:
                user_data[m.user_id] = {
                    'total_bookings': 0,
                    'total_spent': 0,
                    'avg_session_duration': 0,
                    'login_count': 0
                }
            
            user_data[m.user_id]['total_bookings'] += m.total_bookings
            user_data[m.user_id]['total_spent'] += m.total_spent
            user_data[m.user_id]['avg_session_duration'] += m.session_duration
            user_data[m.user_id]['login_count'] += m.login_count
        
        # Convert to DataFrame and sort by total spent
        df = pd.DataFrame([
            {
                'user_id': user_id,
                'total_bookings': data['total_bookings'],
                'total_spent': data['total_spent'],
                'avg_session_duration': data['avg_session_duration'],
                'login_count': data['login_count']
            }
            for user_id, data in user_data.items()
        ])
        
        df = df.sort_values('total_spent', ascending=False).head(limit)
        
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=(
                'Top Users by Revenue',
                'Booking Frequency Distribution',
                'Session Duration vs Bookings',
                'User Engagement Score'
            )
        )
        
        # Top users by revenue
        fig.add_trace(
            go.Bar(x=df['user_id'][:10], y=df['total_spent'][:10], name='Revenue'),
            row=1, col=1
        )
        
        # Booking frequency distribution
        fig.add_trace(
            go.Histogram(x=df['total_bookings'], nbinsx=20, name='Booking Frequency'),
            row=1, col=2
        )
        
        # Session duration vs bookings scatter
        fig.add_trace(
            go.Scatter(
                x=df['avg_session_duration'],
                y=df['total_bookings'],
                mode='markers',
                name='Session vs Bookings'
            ),
            row=2, col=1
        )
        
        # User engagement score (composite metric)
        engagement_score = (
            df['total_bookings'] * 0.4 +
            df['login_count'] * 0.3 +
            (df['avg_session_duration'] / 60) * 0.3  # Convert to hours
        )
        
        fig.add_trace(
            go.Bar(x=df['user_id'][:10], y=engagement_score[:10], name='Engagement Score'),
            row=2, col=2
        )
        
        fig.update_layout(
            title='User Behavior Analytics',
            height=800,
            showlegend=False
        )
        
        return fig.to_json()
    
    def create_predictive_chart(self, predictions):
        """Create a chart showing predictive analytics"""
        if not predictions:
            return None
        
        # Group predictions by type
        demand_predictions = [p for p in predictions if p['model_type'] == 'demand_forecast']
        revenue_predictions = [p for p in predictions if p['model_type'] == 'revenue_forecast']
        
        fig = make_subplots(
            rows=2, cols=1,
            subplot_titles=('Demand Forecast', 'Revenue Forecast')
        )
        
        if demand_predictions:
            dates = [p['prediction_date'] for p in demand_predictions]
            values = [p['predicted_value'] for p in demand_predictions]
            confidence = [p['confidence_score'] for p in demand_predictions]
            
            fig.add_trace(
                go.Scatter(x=dates, y=values, mode='lines+markers', name='Predicted Demand'),
                row=1, col=1
            )
            
            # Add confidence intervals
            upper_bound = [v * (1 + (1 - c) * 0.5) for v, c in zip(values, confidence)]
            lower_bound = [v * (1 - (1 - c) * 0.5) for v, c in zip(values, confidence)]
            
            fig.add_trace(
                go.Scatter(
                    x=dates + dates[::-1],
                    y=upper_bound + lower_bound[::-1],
                    fill='toself',
                    fillcolor='rgba(0,100,80,0.2)',
                    line=dict(color='rgba(255,255,255,0)'),
                    name='Confidence Interval'
                ),
                row=1, col=1
            )
        
        if revenue_predictions:
            dates = [p['prediction_date'] for p in revenue_predictions]
            values = [p['predicted_value'] for p in revenue_predictions]
            
            fig.add_trace(
                go.Scatter(x=dates, y=values, mode='lines+markers', name='Predicted Revenue'),
                row=2, col=1
            )
        
        fig.update_layout(
            title='Predictive Analytics Dashboard',
            height=600
        )
        
        return fig.to_json()
    
    def create_kpi_dashboard(self, start_date, end_date):
        """Create a comprehensive KPI dashboard"""
        # Get all metrics
        booking_metrics = BookingMetric.query.filter(
            BookingMetric.date >= start_date,
            BookingMetric.date <= end_date
        ).all()
        
        revenue_metrics = RevenueAnalytic.query.filter(
            RevenueAnalytic.date >= start_date,
            RevenueAnalytic.date <= end_date
        ).all()
        
        space_metrics = SpaceAnalytic.query.filter(
            SpaceAnalytic.date >= start_date,
            SpaceAnalytic.date <= end_date
        ).all()
        
        # Calculate KPIs
        total_bookings = sum(m.total_bookings for m in booking_metrics)
        total_revenue = sum(m.gross_revenue for m in revenue_metrics)
        avg_occupancy = sum(m.occupancy_rate for m in space_metrics) / len(space_metrics) if space_metrics else 0
        success_rate = sum(m.successful_bookings for m in booking_metrics) / total_bookings * 100 if total_bookings > 0 else 0
        
        # Create gauge charts for KPIs
        fig = make_subplots(
            rows=2, cols=2,
            specs=[[{"type": "indicator"}, {"type": "indicator"}],
                   [{"type": "indicator"}, {"type": "indicator"}]],
            subplot_titles=('Total Bookings', 'Total Revenue', 'Avg Occupancy', 'Success Rate')
        )
        
        fig.add_trace(
            go.Indicator(
                mode="gauge+number",
                value=total_bookings,
                title={'text': "Total Bookings"},
                gauge={'axis': {'range': [None, total_bookings * 1.2]}}
            ),
            row=1, col=1
        )
        
        fig.add_trace(
            go.Indicator(
                mode="gauge+number",
                value=total_revenue,
                title={'text': "Total Revenue ($)"},
                gauge={'axis': {'range': [None, total_revenue * 1.2]}}
            ),
            row=1, col=2
        )
        
        fig.add_trace(
            go.Indicator(
                mode="gauge+number",
                value=avg_occupancy,
                title={'text': "Avg Occupancy (%)"},
                gauge={'axis': {'range': [0, 100]}}
            ),
            row=2, col=1
        )
        
        fig.add_trace(
            go.Indicator(
                mode="gauge+number",
                value=success_rate,
                title={'text': "Success Rate (%)"},
                gauge={'axis': {'range': [0, 100]}}
            ),
            row=2, col=2
        )
        
        fig.update_layout(
            title='Key Performance Indicators Dashboard',
            height=600
        )
        
        return fig.to_json()
