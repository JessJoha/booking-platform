from flasgger import Swagger, swag_from
from flasgger.utils import swag_from
from marshmallow import Schema, fields

# Swagger configuration
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec',
            "route": '/api/v1/apispec.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/api/v1/docs/"
}

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "Booking Analytics API",
        "description": "GraphQL-based analytics microservice for booking data insights and visualizations",
        "version": "1.0.0",
        "contact": {
            "name": "Booking Platform Team",
            "email": "dev@bookingplatform.com"
        },
        "license": {
            "name": "MIT",
            "url": "https://opensource.org/licenses/MIT"
        }
    },
    "host": "localhost:3007",
    "basePath": "/api/v1",
    "schemes": ["http", "https"],
    "consumes": ["application/json"],
    "produces": ["application/json"],
    "securityDefinitions": {
        "ApiKeyAuth": {
            "type": "apiKey",
            "name": "x-api-key",
            "in": "header"
        },
        "BearerAuth": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "JWT token format: Bearer {token}"
        }
    },
    "security": [
        {"ApiKeyAuth": []},
        {"BearerAuth": []}
    ],
    "tags": [
        {
            "name": "Analytics",
            "description": "Analytics endpoints for booking data"
        },
        {
            "name": "GraphQL",
            "description": "GraphQL endpoint for flexible data queries"
        },
        {
            "name": "Metrics",
            "description": "Key performance metrics and KPIs"
        },
        {
            "name": "Visualizations",
            "description": "Data visualization endpoints"
        },
        {
            "name": "Predictions",
            "description": "Machine learning predictions and forecasts"
        },
        {
            "name": "Health",
            "description": "Service health and status endpoints"
        }
    ]
}

# Schema definitions for Swagger
class BookingAnalyticsSchema(Schema):
    """Schema for booking analytics data"""
    total_bookings = fields.Integer(description="Total number of bookings")
    total_revenue = fields.Float(description="Total revenue generated")
    average_booking_value = fields.Float(description="Average booking value")
    occupancy_rate = fields.Float(description="Space occupancy rate percentage")
    popular_times = fields.List(fields.String(), description="Most popular booking times")
    popular_spaces = fields.List(fields.String(), description="Most popular spaces")
    customer_satisfaction = fields.Float(description="Average customer satisfaction score")
    cancellation_rate = fields.Float(description="Booking cancellation rate percentage")
    
class MetricsSchema(Schema):
    """Schema for metrics data"""
    name = fields.String(description="Metric name")
    value = fields.Float(description="Metric value")
    unit = fields.String(description="Metric unit")
    timestamp = fields.DateTime(description="Metric timestamp")
    trend = fields.String(description="Trend direction", enum=["up", "down", "stable"])
    
class VisualizationSchema(Schema):
    """Schema for visualization data"""
    chart_type = fields.String(description="Chart type", enum=["bar", "line", "pie", "heatmap"])
    title = fields.String(description="Chart title")
    data = fields.Raw(description="Chart data")
    options = fields.Raw(description="Chart options")
    
class PredictionSchema(Schema):
    """Schema for prediction data"""
    type = fields.String(description="Prediction type")
    value = fields.Float(description="Predicted value")
    confidence = fields.Float(description="Confidence score (0-1)")
    period = fields.String(description="Prediction period")
    timestamp = fields.DateTime(description="Prediction timestamp")
    
class ErrorSchema(Schema):
    """Schema for error responses"""
    success = fields.Boolean(default=False)
    error = fields.String(description="Error message")
    code = fields.String(description="Error code")
    details = fields.Raw(description="Additional error details")

class HealthSchema(Schema):
    """Schema for health check responses"""
    status = fields.String(description="Service status")
    service = fields.String(description="Service name")
    version = fields.String(description="Service version")
    timestamp = fields.DateTime(description="Health check timestamp")
    uptime = fields.Float(description="Service uptime in seconds")
    database = fields.Raw(description="Database connection status")
    cache = fields.Raw(description="Cache connection status")

# Swagger documentation templates
analytics_overview_doc = {
    "tags": ["Analytics"],
    "summary": "Get booking analytics overview",
    "description": "Returns a comprehensive overview of booking analytics including key metrics and trends",
    "parameters": [
        {
            "name": "start_date",
            "in": "query",
            "type": "string",
            "format": "date",
            "description": "Start date for analytics period (YYYY-MM-DD)"
        },
        {
            "name": "end_date",
            "in": "query",
            "type": "string",
            "format": "date",
            "description": "End date for analytics period (YYYY-MM-DD)"
        },
        {
            "name": "space_id",
            "in": "query",
            "type": "string",
            "description": "Filter by specific space ID"
        }
    ],
    "responses": {
        "200": {
            "description": "Analytics overview retrieved successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean"},
                    "data": BookingAnalyticsSchema().fields
                }
            }
        },
        "400": {
            "description": "Bad request",
            "schema": ErrorSchema().fields
        },
        "500": {
            "description": "Internal server error",
            "schema": ErrorSchema().fields
        }
    }
}

metrics_doc = {
    "tags": ["Metrics"],
    "summary": "Get key performance metrics",
    "description": "Returns key performance indicators and metrics for the booking platform",
    "parameters": [
        {
            "name": "metrics",
            "in": "query",
            "type": "array",
            "items": {"type": "string"},
            "description": "Specific metrics to retrieve"
        },
        {
            "name": "period",
            "in": "query",
            "type": "string",
            "enum": ["daily", "weekly", "monthly", "yearly"],
            "default": "daily",
            "description": "Metrics aggregation period"
        }
    ],
    "responses": {
        "200": {
            "description": "Metrics retrieved successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean"},
                    "data": {
                        "type": "array",
                        "items": MetricsSchema().fields
                    }
                }
            }
        },
        "400": {
            "description": "Bad request",
            "schema": ErrorSchema().fields
        },
        "500": {
            "description": "Internal server error",
            "schema": ErrorSchema().fields
        }
    }
}

visualization_doc = {
    "tags": ["Visualizations"],
    "summary": "Get data visualization",
    "description": "Returns data formatted for visualization charts and graphs",
    "parameters": [
        {
            "name": "chart_type",
            "in": "path",
            "type": "string",
            "required": True,
            "enum": ["bar", "line", "pie", "heatmap"],
            "description": "Type of chart to generate"
        },
        {
            "name": "metric",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "Metric to visualize"
        },
        {
            "name": "period",
            "in": "query",
            "type": "string",
            "enum": ["daily", "weekly", "monthly"],
            "default": "daily",
            "description": "Data aggregation period"
        }
    ],
    "responses": {
        "200": {
            "description": "Visualization data retrieved successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean"},
                    "data": VisualizationSchema().fields
                }
            }
        },
        "400": {
            "description": "Bad request",
            "schema": ErrorSchema().fields
        },
        "500": {
            "description": "Internal server error",
            "schema": ErrorSchema().fields
        }
    }
}

prediction_doc = {
    "tags": ["Predictions"],
    "summary": "Get prediction data",
    "description": "Returns machine learning predictions and forecasts",
    "parameters": [
        {
            "name": "type",
            "in": "path",
            "type": "string",
            "required": True,
            "enum": ["demand", "revenue", "occupancy"],
            "description": "Type of prediction to generate"
        },
        {
            "name": "period",
            "in": "query",
            "type": "string",
            "enum": ["daily", "weekly", "monthly"],
            "default": "weekly",
            "description": "Prediction period"
        },
        {
            "name": "space_id",
            "in": "query",
            "type": "string",
            "description": "Filter by specific space ID"
        }
    ],
    "responses": {
        "200": {
            "description": "Prediction data retrieved successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean"},
                    "data": PredictionSchema().fields
                }
            }
        },
        "400": {
            "description": "Bad request",
            "schema": ErrorSchema().fields
        },
        "500": {
            "description": "Internal server error",
            "schema": ErrorSchema().fields
        }
    }
}

graphql_doc = {
    "tags": ["GraphQL"],
    "summary": "GraphQL endpoint",
    "description": "Main GraphQL endpoint for flexible data queries and mutations",
    "parameters": [
        {
            "name": "query",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "GraphQL query string"
                    },
                    "variables": {
                        "type": "object",
                        "description": "GraphQL query variables"
                    }
                }
            }
        }
    ],
    "responses": {
        "200": {
            "description": "GraphQL query executed successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "data": {"type": "object"},
                    "errors": {
                        "type": "array",
                        "items": {"type": "object"}
                    }
                }
            }
        },
        "400": {
            "description": "Bad request",
            "schema": ErrorSchema().fields
        },
        "500": {
            "description": "Internal server error",
            "schema": ErrorSchema().fields
        }
    }
}

health_doc = {
    "tags": ["Health"],
    "summary": "Health check",
    "description": "Returns the health status of the booking analytics service",
    "responses": {
        "200": {
            "description": "Service is healthy",
            "schema": {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean"},
                    "data": HealthSchema().fields
                }
            }
        },
        "500": {
            "description": "Service is unhealthy",
            "schema": ErrorSchema().fields
        }
    }
}

def init_swagger(app):
    """Initialize Swagger documentation for the Flask app"""
    swagger = Swagger(app, config=swagger_config, template=swagger_template)
    return swagger
