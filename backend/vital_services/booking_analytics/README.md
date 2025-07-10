# 📊 Booking Analytics Service

## Overview
Advanced GraphQL-based analytics and reporting service for the Booking Platform, featuring machine learning predictions, real-time dashboards, and comprehensive business intelligence.

## Features
- **GraphQL API**: Flexible query language for complex analytics
- **Predictive Analytics**: ML-powered demand and revenue forecasting
- **Real-time Dashboards**: Interactive visualizations with Plotly
- **KPI Monitoring**: Key performance indicators tracking
- **User Behavior Analysis**: Comprehensive user journey analytics
- **Space Performance**: Occupancy and utilization metrics
- **Revenue Analytics**: Financial performance tracking
- **Custom Reports**: Flexible reporting engine

## Tech Stack
- **Python 3.11** with Flask framework
- **GraphQL** with Graphene library
- **PostgreSQL** for analytics data storage
- **Pandas & NumPy** for data processing
- **Scikit-learn** for machine learning
- **Plotly** for interactive visualizations
- **Redis** for caching and session management

## GraphQL API

### Available Queries

#### Basic Analytics
```graphql
query {
  bookingMetrics(startDate: "2024-01-01", endDate: "2024-01-31") {
    id
    date
    totalBookings
    successfulBookings
    cancelledBookings
    totalRevenue
    occupancyRate
  }
}
```

#### User Analytics
```graphql
query {
  userAnalytics(userId: "123", startDate: "2024-01-01") {
    userId
    totalBookings
    totalSpent
    averageBookingValue
    preferredSpaces
    bookingLeadTime
  }
}
```

#### Revenue Summary
```graphql
query {
  revenueSummary(startDate: "2024-01-01", endDate: "2024-01-31") {
    totalRevenue
    averageBookingValue
    revenueGrowth
    revenueByPaymentMethod
  }
}
```

#### Predictive Analytics
```graphql
query {
  demandForecast(spaceId: "space_123", daysAhead: 7) {
    predictionDate
    predictedValue
    confidenceScore
    modelType
  }
}
```

#### Space Performance
```graphql
query {
  spacePerformance(startDate: "2024-01-01", limit: 10) {
    spaceId
    occupancyRate
    revenue
    bookingCount
    averageRating
  }
}
```

### Mutations
```graphql
mutation {
  createBookingMetric(
    date: "2024-01-15"
    totalBookings: 25
    successfulBookings: 23
    totalRevenue: 1250.00
    occupancyRate: 85.5
  ) {
    bookingMetric {
      id
      date
      totalBookings
    }
  }
}
```

## Machine Learning Features

### Demand Forecasting
- **Random Forest Regressor** for booking demand prediction
- **Temporal features**: Day of week, month, seasonality
- **Space-specific models**: Individual predictions per space
- **Confidence intervals**: Uncertainty quantification

### Revenue Projections
- **Multi-factor models**: Bookings, seasonality, trends
- **Payment method analysis**: Revenue by payment type
- **Growth rate calculations**: Period-over-period comparisons

### User Behavior Prediction
- **Engagement scoring**: User activity metrics
- **Churn prediction**: Risk assessment for user retention
- **Preference learning**: Space and time preferences

## Visualization Service

### Available Charts
- **Booking Trends**: Time series of booking patterns
- **Revenue Analytics**: Financial performance over time
- **Occupancy Heatmaps**: Space utilization visualization
- **User Behavior**: Engagement and activity patterns
- **KPI Dashboards**: Real-time performance indicators
- **Predictive Charts**: Forecast visualizations

### Chart Generation
```python
from services.visualization_service import VisualizationService

viz_service = VisualizationService()

# Generate booking trends chart
chart_json = viz_service.create_booking_trends_chart(
    start_date=datetime(2024, 1, 1),
    end_date=datetime(2024, 1, 31),
    space_id="space_123"
)

# Generate KPI dashboard
kpi_dashboard = viz_service.create_kpi_dashboard(
    start_date=datetime(2024, 1, 1),
    end_date=datetime(2024, 1, 31)
)
```

## Data Models

### BookingMetric
- Daily booking statistics per space
- Success rates and cancellation tracking
- Revenue and occupancy metrics

### UserAnalytic
- User behavior and engagement metrics
- Booking patterns and preferences
- Financial activity tracking

### SpaceAnalytic
- Space-specific performance metrics
- Occupancy and utilization rates
- Quality and rating information

### RevenueAnalytic
- Financial performance tracking
- Payment method breakdowns
- Commission and fee analysis

### PredictiveAnalytic
- ML model predictions storage
- Confidence scores and metadata
- Historical accuracy tracking

## Usage Examples

### GraphQL Queries
```bash
# Query booking summary
curl -X POST http://localhost:5002/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { bookingSummary(startDate: \"2024-01-01\", endDate: \"2024-01-31\") { totalBookings successfulBookings bookingRate } }"
  }'

# Get space performance
curl -X POST http://localhost:5002/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { spacePerformance(limit: 5) { spaceId occupancyRate revenue bookingCount } }"
  }'
```

### Python Client
```python
import requests

def query_analytics(query):
    response = requests.post(
        'http://localhost:5002/graphql',
        json={'query': query}
    )
    return response.json()

# Get revenue summary
revenue_query = """
query {
  revenueSummary(startDate: "2024-01-01", endDate: "2024-01-31") {
    totalRevenue
    averageBookingValue
    revenueGrowth
  }
}
"""

result = query_analytics(revenue_query)
print(result['data']['revenueSummary'])
```

## Environment Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize database**:
   ```bash
   python -c "from app import app, db; app.app_context().push(); db.create_all()"
   ```

4. **Start the service**:
   ```bash
   python app.py
   ```

5. **Access GraphiQL interface**:
   ```
   http://localhost:5002/graphql
   ```

## Docker Deployment

```bash
# Build image
docker build -t booking-analytics .

# Run container
docker run -p 5002:5002 --env-file .env booking-analytics
```

## Predictive Analytics Setup

### Training Models
```python
from services.predictive_service import PredictiveAnalyticsService

predictor = PredictiveAnalyticsService()

# Train demand forecasting model
result = predictor.train_demand_forecasting_model()
print(f"Model trained with accuracy: {result['model_score']}")

# Generate forecasts
forecasts = predictor.generate_forecasts(days_ahead=7)
print(f"Generated {len(forecasts)} predictions")
```

### Automated Predictions
Set up a scheduled job to run predictions:
```bash
# Add to crontab for daily predictions
0 6 * * * cd /app && python -c "from services.predictive_service import PredictiveAnalyticsService; PredictiveAnalyticsService().generate_forecasts()"
```

## Integration Points

### Data Sources
- **Reservation Management**: Booking events and status updates
- **User Management**: User activity and authentication data
- **Space Management**: Space configuration and availability
- **Payment Gateway**: Transaction and revenue data

### API Integration
The service automatically collects data from other microservices via:
- **Webhook endpoints**: Real-time event processing
- **Scheduled jobs**: Batch data synchronization
- **Event streaming**: Real-time analytics updates

## Performance Optimization

### Caching Strategy
- **Redis caching**: Query result caching for 5-15 minutes
- **Model caching**: ML models cached for 1 hour
- **Visualization caching**: Chart data cached for 10 minutes

### Database Optimization
- **Indexes**: Optimized for time-series queries
- **Partitioning**: Date-based table partitioning
- **Aggregation**: Pre-computed daily/weekly summaries

### Scalability
- **Horizontal scaling**: Stateless service design
- **Read replicas**: Analytics-specific read replicas
- **Async processing**: Background ML training jobs

## Monitoring & Observability

- **Performance metrics**: Query execution times
- **ML model accuracy**: Prediction accuracy tracking
- **Data quality**: Completeness and validity checks
- **Alert system**: Anomaly detection and alerting

## Development Guidelines

### Adding New Analytics
1. Define data model in `models.py`
2. Create GraphQL types in `schema.py`
3. Implement resolvers for queries
4. Add visualization methods if needed
5. Write tests for new functionality

### Custom Predictions
1. Extend `PredictiveAnalyticsService`
2. Implement training and prediction methods
3. Add GraphQL queries for predictions
4. Schedule regular model retraining
