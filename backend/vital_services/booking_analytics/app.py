from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_graphql import GraphQLView
import os
from dotenv import load_dotenv
from swagger_config import init_swagger, analytics_overview_doc, metrics_doc, visualization_doc, prediction_doc, graphql_doc, health_doc
from flasgger import swag_from

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/booking_analytics')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Initialize extensions
from models import db
db.init_app(app)
CORS(app)


from models import *
from schema import schema

# GraphQL endpoint
app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True  
    )
)


swagger = init_swagger(app)


@app.route('/api/v1/metrics', methods=['GET'])
@swag_from(metrics_doc)
def get_metrics():
    """Get key performance metrics"""
    try:
       
        metrics = [
            {
                'name': 'Total Revenue',
                'value': 125000.50,
                'unit': 'USD',
                'timestamp': '2024-01-15T10:00:00Z',
                'trend': 'up'
            },
            {
                'name': 'Occupancy Rate',
                'value': 78.5,
                'unit': '%',
                'timestamp': '2024-01-15T10:00:00Z',
                'trend': 'stable'
            },
            {
                'name': 'Customer Satisfaction',
                'value': 4.6,
                'unit': 'stars',
                'timestamp': '2024-01-15T10:00:00Z',
                'trend': 'up'
            }
        ]
        
        return jsonify({
            'success': True,
            'data': metrics
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'code': 'METRICS_ERROR'
        }), 500


@app.route('/', methods=['GET'])
@swag_from(health_doc)
def health_check():
    """Service health check"""
    try:
        # Check database connection
        db_status = 'connected'
        try:
            db.session.execute('SELECT 1')
        except Exception:
            db_status = 'disconnected'
        
        return jsonify({
            'success': True,
            'data': {
                'status': 'healthy',
                'service': 'booking-analytics',
                'version': '1.0.0',
                'timestamp': '2024-01-15T10:00:00Z',
                'uptime': 3600,
                'database': {
                    'status': db_status,
                    'provider': 'postgresql'
                },
                'cache': {
                    'status': 'connected',
                    'provider': 'redis'
                }
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'code': 'HEALTH_ERROR'
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return {'error': 'Endpoint not found', 'code': 404}, 404

@app.errorhandler(500)
def internal_error(error):
    return {'error': 'Internal server error', 'code': 500}, 500

# Create tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 7001))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
