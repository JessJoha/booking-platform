import graphene
from graphene import ObjectType, String, Int, Float, List, Field, Argument, DateTime, Date
from graphene_sqlalchemy import SQLAlchemyObjectType
from models import (
    BookingMetric, UserAnalytic, SpaceAnalytic, 
    RevenueAnalytic, SystemMetric, PredictiveAnalytic, db
)
from datetime import datetime, timedelta
import json

# GraphQL Object Types
class BookingMetricType(SQLAlchemyObjectType):
    class Meta:
        model = BookingMetric
        interfaces = (graphene.relay.Node,)

class UserAnalyticType(SQLAlchemyObjectType):
    class Meta:
        model = UserAnalytic
        interfaces = (graphene.relay.Node,)

class SpaceAnalyticType(SQLAlchemyObjectType):
    class Meta:
        model = SpaceAnalytic
        interfaces = (graphene.relay.Node,)

class RevenueAnalyticType(SQLAlchemyObjectType):
    class Meta:
        model = RevenueAnalytic
        interfaces = (graphene.relay.Node,)

class SystemMetricType(SQLAlchemyObjectType):
    class Meta:
        model = SystemMetric
        interfaces = (graphene.relay.Node,)

class PredictiveAnalyticType(SQLAlchemyObjectType):
    class Meta:
        model = PredictiveAnalytic
        interfaces = (graphene.relay.Node,)

# Custom Types for Complex Analytics
class BookingSummary(ObjectType):
    total_bookings = Int()
    successful_bookings = Int()
    cancelled_bookings = Int()
    no_show_bookings = Int()
    booking_rate = Float()
    cancellation_rate = Float()

class RevenueSummary(ObjectType):
    total_revenue = Float()
    average_booking_value = Float()
    revenue_growth = Float()
    revenue_by_payment_method = String()  # JSON string

class PopularTime(ObjectType):
    hour = Int()
    day_of_week = Int()
    booking_count = Int()
    revenue = Float()

class SpacePerformance(ObjectType):
    space_id = String()
    occupancy_rate = Float()
    revenue = Float()
    booking_count = Int()
    average_rating = Float()

class UserBehavior(ObjectType):
    user_id = String()
    total_bookings = Int()
    total_spent = Float()
    average_lead_time = Float()
    preferred_spaces = List(String)
    loyalty_score = Float()

class PredictionResult(ObjectType):
    prediction_date = Date()
    predicted_value = Float()
    confidence_score = Float()
    model_type = String()

# Query Class
class Query(ObjectType):
    # Basic metric queries
    booking_metrics = List(BookingMetricType, 
                          start_date=Argument(Date),
                          end_date=Argument(Date),
                          space_id=Argument(String))
    
    user_analytics = List(UserAnalyticType,
                         user_id=Argument(String),
                         start_date=Argument(Date),
                         end_date=Argument(Date))
    
    space_analytics = List(SpaceAnalyticType,
                          space_id=Argument(String),
                          start_date=Argument(Date),
                          end_date=Argument(Date))
    
    revenue_analytics = List(RevenueAnalyticType,
                            start_date=Argument(Date),
                            end_date=Argument(Date))
    
    system_metrics = List(SystemMetricType,
                         start_time=Argument(DateTime),
                         end_time=Argument(DateTime))
    
    predictive_analytics = List(PredictiveAnalyticType,
                               model_type=Argument(String),
                               prediction_date=Argument(Date))

    # Complex analytics queries
    booking_summary = Field(BookingSummary,
                           start_date=Argument(Date),
                           end_date=Argument(Date),
                           space_id=Argument(String))
    
    revenue_summary = Field(RevenueSummary,
                           start_date=Argument(Date),
                           end_date=Argument(Date))
    
    popular_times = List(PopularTime,
                        start_date=Argument(Date),
                        end_date=Argument(Date),
                        limit=Argument(Int, default_value=10))
    
    space_performance = List(SpacePerformance,
                            start_date=Argument(Date),
                            end_date=Argument(Date),
                            limit=Argument(Int, default_value=20))
    
    user_behavior_insights = List(UserBehavior,
                                 start_date=Argument(Date),
                                 end_date=Argument(Date),
                                 limit=Argument(Int, default_value=50))
    
    demand_forecast = List(PredictionResult,
                          space_id=Argument(String),
                          days_ahead=Argument(Int, default_value=7))
    
    revenue_projection = List(PredictionResult,
                             days_ahead=Argument(Int, default_value=30))

    # Resolver methods
    def resolve_booking_metrics(self, info, start_date=None, end_date=None, space_id=None):
        query = BookingMetric.query
        
        if start_date:
            query = query.filter(BookingMetric.date >= start_date)
        if end_date:
            query = query.filter(BookingMetric.date <= end_date)
        if space_id:
            query = query.filter(BookingMetric.space_id == space_id)
            
        return query.order_by(BookingMetric.date.desc()).all()

    def resolve_user_analytics(self, info, user_id=None, start_date=None, end_date=None):
        query = UserAnalytic.query
        
        if user_id:
            query = query.filter(UserAnalytic.user_id == user_id)
        if start_date:
            query = query.filter(UserAnalytic.date >= start_date)
        if end_date:
            query = query.filter(UserAnalytic.date <= end_date)
            
        return query.order_by(UserAnalytic.date.desc()).all()

    def resolve_space_analytics(self, info, space_id=None, start_date=None, end_date=None):
        query = SpaceAnalytic.query
        
        if space_id:
            query = query.filter(SpaceAnalytic.space_id == space_id)
        if start_date:
            query = query.filter(SpaceAnalytic.date >= start_date)
        if end_date:
            query = query.filter(SpaceAnalytic.date <= end_date)
            
        return query.order_by(SpaceAnalytic.date.desc()).all()

    def resolve_revenue_analytics(self, info, start_date=None, end_date=None):
        query = RevenueAnalytic.query
        
        if start_date:
            query = query.filter(RevenueAnalytic.date >= start_date)
        if end_date:
            query = query.filter(RevenueAnalytic.date <= end_date)
            
        return query.order_by(RevenueAnalytic.date.desc()).all()

    def resolve_system_metrics(self, info, start_time=None, end_time=None):
        query = SystemMetric.query
        
        if start_time:
            query = query.filter(SystemMetric.timestamp >= start_time)
        if end_time:
            query = query.filter(SystemMetric.timestamp <= end_time)
            
        return query.order_by(SystemMetric.timestamp.desc()).limit(1000).all()

    def resolve_predictive_analytics(self, info, model_type=None, prediction_date=None):
        query = PredictiveAnalytic.query
        
        if model_type:
            query = query.filter(PredictiveAnalytic.model_type == model_type)
        if prediction_date:
            query = query.filter(PredictiveAnalytic.prediction_date == prediction_date)
            
        return query.order_by(PredictiveAnalytic.created_at.desc()).all()

    def resolve_booking_summary(self, info, start_date=None, end_date=None, space_id=None):
        query = BookingMetric.query
        
        if start_date:
            query = query.filter(BookingMetric.date >= start_date)
        if end_date:
            query = query.filter(BookingMetric.date <= end_date)
        if space_id:
            query = query.filter(BookingMetric.space_id == space_id)
        
        metrics = query.all()
        
        if not metrics:
            return BookingSummary(
                total_bookings=0,
                successful_bookings=0,
                cancelled_bookings=0,
                no_show_bookings=0,
                booking_rate=0.0,
                cancellation_rate=0.0
            )
        
        total_bookings = sum(m.total_bookings for m in metrics)
        successful_bookings = sum(m.successful_bookings for m in metrics)
        cancelled_bookings = sum(m.cancelled_bookings for m in metrics)
        no_show_bookings = sum(m.no_show_bookings for m in metrics)
        
        booking_rate = (successful_bookings / total_bookings * 100) if total_bookings > 0 else 0
        cancellation_rate = (cancelled_bookings / total_bookings * 100) if total_bookings > 0 else 0
        
        return BookingSummary(
            total_bookings=total_bookings,
            successful_bookings=successful_bookings,
            cancelled_bookings=cancelled_bookings,
            no_show_bookings=no_show_bookings,
            booking_rate=booking_rate,
            cancellation_rate=cancellation_rate
        )

    def resolve_revenue_summary(self, info, start_date=None, end_date=None):
        query = RevenueAnalytic.query
        
        if start_date:
            query = query.filter(RevenueAnalytic.date >= start_date)
        if end_date:
            query = query.filter(RevenueAnalytic.date <= end_date)
        
        revenue_data = query.all()
        
        if not revenue_data:
            return RevenueSummary(
                total_revenue=0.0,
                average_booking_value=0.0,
                revenue_growth=0.0,
                revenue_by_payment_method="{}"
            )
        
        total_revenue = sum(r.gross_revenue for r in revenue_data)
        total_transactions = sum(r.successful_transactions for r in revenue_data)
        average_booking_value = total_revenue / total_transactions if total_transactions > 0 else 0
        
        # Calculate revenue by payment method
        payment_methods = {
            'card': sum(r.card_payments for r in revenue_data),
            'digital_wallet': sum(r.digital_wallet_payments for r in revenue_data),
            'bank_transfer': sum(r.bank_transfer_payments for r in revenue_data)
        }
        
        return RevenueSummary(
            total_revenue=total_revenue,
            average_booking_value=average_booking_value,
            revenue_growth=0.0,  # Would need historical comparison
            revenue_by_payment_method=json.dumps(payment_methods)
        )

    def resolve_space_performance(self, info, start_date=None, end_date=None, limit=20):
        query = SpaceAnalytic.query
        
        if start_date:
            query = query.filter(SpaceAnalytic.date >= start_date)
        if end_date:
            query = query.filter(SpaceAnalytic.date <= end_date)
        
        # Group by space_id and aggregate metrics
        from sqlalchemy import func
        
        subquery = query.with_entities(
            SpaceAnalytic.space_id,
            func.avg(SpaceAnalytic.occupancy_rate).label('avg_occupancy'),
            func.sum(SpaceAnalytic.total_bookings).label('total_bookings'),
            func.avg(SpaceAnalytic.average_rating).label('avg_rating')
        ).group_by(SpaceAnalytic.space_id).limit(limit).all()
        
        return [
            SpacePerformance(
                space_id=row.space_id,
                occupancy_rate=row.avg_occupancy or 0,
                revenue=0.0,  # Would need to join with revenue data
                booking_count=row.total_bookings or 0,
                average_rating=row.avg_rating or 0
            )
            for row in subquery
        ]

# Mutation Class for data updates
class CreateBookingMetric(graphene.Mutation):
    class Arguments:
        date = Date(required=True)
        space_id = String()
        total_bookings = Int(required=True)
        successful_bookings = Int(required=True)
        cancelled_bookings = Int()
        total_revenue = Float()
        occupancy_rate = Float()

    booking_metric = Field(BookingMetricType)

    def mutate(self, info, date, total_bookings, successful_bookings, **kwargs):
        booking_metric = BookingMetric(
            date=date,
            total_bookings=total_bookings,
            successful_bookings=successful_bookings,
            **kwargs
        )
        db.session.add(booking_metric)
        db.session.commit()
        return CreateBookingMetric(booking_metric=booking_metric)

class Mutation(ObjectType):
    create_booking_metric = CreateBookingMetric.Field()

# Schema definition
schema = graphene.Schema(query=Query, mutation=Mutation)
