from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from datetime import datetime, timedelta
import json

# Create db instance here to avoid circular imports
db = SQLAlchemy()

class BookingMetric(db.Model):
    """Store booking-related metrics and KPIs"""
    __tablename__ = 'booking_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, index=True)
    space_id = db.Column(db.String(100), index=True)
    user_id = db.Column(db.String(100), index=True)
    
    # Booking statistics
    total_bookings = db.Column(db.Integer, default=0)
    successful_bookings = db.Column(db.Integer, default=0)
    cancelled_bookings = db.Column(db.Integer, default=0)
    no_show_bookings = db.Column(db.Integer, default=0)
    
    # Revenue metrics
    total_revenue = db.Column(db.Float, default=0.0)
    average_booking_value = db.Column(db.Float, default=0.0)
    
    # Time-based metrics
    peak_hour_start = db.Column(db.Integer)  # Hour of day (0-23)
    peak_hour_end = db.Column(db.Integer)
    average_booking_duration = db.Column(db.Float)  # In hours
    
    # Occupancy metrics
    occupancy_rate = db.Column(db.Float, default=0.0)  # Percentage
    utilization_rate = db.Column(db.Float, default=0.0)  # Percentage
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserAnalytic(db.Model):
    """Store user behavior analytics"""
    __tablename__ = 'user_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False, index=True)
    
    # User behavior metrics
    total_bookings = db.Column(db.Integer, default=0)
    successful_bookings = db.Column(db.Integer, default=0)
    cancelled_bookings = db.Column(db.Integer, default=0)
    no_shows = db.Column(db.Integer, default=0)
    
    # Engagement metrics
    login_count = db.Column(db.Integer, default=0)
    session_duration = db.Column(db.Float, default=0.0)  # In minutes
    pages_visited = db.Column(db.Integer, default=0)
    
    # Preference metrics
    preferred_spaces = db.Column(db.Text)  # JSON array of space IDs
    preferred_times = db.Column(db.Text)  # JSON array of time slots
    booking_lead_time = db.Column(db.Float, default=0.0)  # Days in advance
    
    # Financial metrics
    total_spent = db.Column(db.Float, default=0.0)
    average_booking_value = db.Column(db.Float, default=0.0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SpaceAnalytic(db.Model):
    """Store space-specific analytics"""
    __tablename__ = 'space_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    space_id = db.Column(db.String(100), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False, index=True)
    
    # Usage metrics
    total_bookings = db.Column(db.Integer, default=0)
    unique_users = db.Column(db.Integer, default=0)
    repeat_users = db.Column(db.Integer, default=0)
    
    # Time-based metrics
    peak_hours = db.Column(db.Text)  # JSON array of peak hours
    off_peak_hours = db.Column(db.Text)  # JSON array of off-peak hours
    average_booking_duration = db.Column(db.Float, default=0.0)
    
    # Performance metrics
    occupancy_rate = db.Column(db.Float, default=0.0)
    utilization_rate = db.Column(db.Float, default=0.0)
    revenue_per_hour = db.Column(db.Float, default=0.0)
    
    # Quality metrics
    average_rating = db.Column(db.Float, default=0.0)
    total_reviews = db.Column(db.Integer, default=0)
    complaint_count = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class RevenueAnalytic(db.Model):
    """Store revenue and financial analytics"""
    __tablename__ = 'revenue_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, index=True)
    
    # Revenue metrics
    gross_revenue = db.Column(db.Float, default=0.0)
    net_revenue = db.Column(db.Float, default=0.0)
    refunds_amount = db.Column(db.Float, default=0.0)
    
    # Transaction metrics
    total_transactions = db.Column(db.Integer, default=0)
    successful_transactions = db.Column(db.Integer, default=0)
    failed_transactions = db.Column(db.Integer, default=0)
    refunded_transactions = db.Column(db.Integer, default=0)
    
    # Payment method breakdown
    card_payments = db.Column(db.Float, default=0.0)
    digital_wallet_payments = db.Column(db.Float, default=0.0)
    bank_transfer_payments = db.Column(db.Float, default=0.0)
    
    # Commission and fees
    platform_fees = db.Column(db.Float, default=0.0)
    payment_processing_fees = db.Column(db.Float, default=0.0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SystemMetric(db.Model):
    """Store system performance and operational metrics"""
    __tablename__ = 'system_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False, index=True, default=datetime.utcnow)
    
    # Performance metrics
    response_time_avg = db.Column(db.Float, default=0.0)  # Milliseconds
    response_time_p95 = db.Column(db.Float, default=0.0)
    response_time_p99 = db.Column(db.Float, default=0.0)
    
    # System health
    cpu_usage = db.Column(db.Float, default=0.0)  # Percentage
    memory_usage = db.Column(db.Float, default=0.0)  # Percentage
    disk_usage = db.Column(db.Float, default=0.0)  # Percentage
    
    # API metrics
    total_requests = db.Column(db.Integer, default=0)
    successful_requests = db.Column(db.Integer, default=0)
    failed_requests = db.Column(db.Integer, default=0)
    error_rate = db.Column(db.Float, default=0.0)  # Percentage
    
    # Service-specific metrics
    active_users = db.Column(db.Integer, default=0)
    concurrent_bookings = db.Column(db.Integer, default=0)
    queue_length = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class PredictiveAnalytic(db.Model):
    """Store predictive analytics and forecasts"""
    __tablename__ = 'predictive_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    model_type = db.Column(db.String(50), nullable=False)  # 'demand_forecast', 'revenue_projection', etc.
    prediction_date = db.Column(db.Date, nullable=False, index=True)
    created_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    
    # Prediction data
    predicted_value = db.Column(db.Float, nullable=False)
    confidence_interval_lower = db.Column(db.Float)
    confidence_interval_upper = db.Column(db.Float)
    confidence_score = db.Column(db.Float)  # 0-1 score
    
    # Context
    space_id = db.Column(db.String(100), index=True)
    time_of_day = db.Column(db.Integer)  # Hour of day
    day_of_week = db.Column(db.Integer)  # 0-6
    
    # Model metadata
    model_version = db.Column(db.String(20))
    features_used = db.Column(db.Text)  # JSON array of feature names
    training_accuracy = db.Column(db.Float)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
