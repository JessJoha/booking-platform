require 'sinatra'
require 'sinatra/json'
require 'sinatra/reloader' if development?
require 'dotenv/load'
require 'active_record'
require 'jwt'
require 'mail'
require 'twilio-ruby'
require 'redis'
require 'rack/cors'
require_relative 'swagger_config'

# CORS configuration
use Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: [:get, :post, :put, :delete, :options]
  end
end

# Database configuration
ActiveRecord::Base.establish_connection(
  adapter: 'postgresql',
  host: ENV['DB_HOST'] || 'localhost',
  port: ENV['DB_PORT'] || 5432,
  username: ENV['DB_USER'] || 'postgres',
  password: ENV['DB_PASSWORD'] || 'password',
  database: ENV['DB_NAME'] || 'booking_notifications'
)

# Models
require_relative 'models/notification'
require_relative 'models/notification_template'

# Services
require_relative 'services/email_service'
require_relative 'services/sms_service'
require_relative 'services/push_notification_service'

# Routes
require_relative 'routes/notifications'

set :port, ENV['PORT'] || 4006
set :bind, '0.0.0.0'
set :show_exceptions, true

# Health check endpoint
get '/health' do
  json({ status: 'healthy', service: 'notification_service', timestamp: Time.now })
end

# Default route
get '/' do
  json({
    message: 'Booking Platform - Notification Service',
    version: '1.0.0',
    endpoints: [
      'POST /notifications/send',
      'GET /notifications/:id',
      'GET /notifications/user/:user_id',
      'POST /templates',
      'GET /templates'
    ]
  })
end

# Error handlers
error 404 do
  json({ error: 'Not found', code: 404 })
end

error 500 do
  json({ error: 'Internal server error', code: 500 })
end

# Swagger documentation endpoints
get '/api/v1/swagger.json' do
  content_type :json
  swagger_doc = {
    swagger: '2.0',
    info: {
      title: 'Notification Service API',
      description: 'Microservice for handling email, SMS, and push notifications',
      version: '1.0.0',
      contact: {
        name: 'Booking Platform Team',
        email: 'dev@bookingplatform.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    host: "#{request.host}:#{request.port}",
    basePath: '/api/v1',
    schemes: [request.scheme],
    consumes: ['application/json'],
    produces: ['application/json'],
    paths: {
      '/notifications/email' => {
        post: {
          summary: 'Send email notification',
          description: 'Sends an email notification to the specified recipient',
          tags: ['Email'],
          parameters: [{
            name: 'notification',
            in: 'body',
            required: true,
            schema: { '$ref' => '#/definitions/NotificationRequest' }
          }],
          responses: {
            '201' => {
              description: 'Email sent successfully',
              schema: { '$ref' => '#/definitions/NotificationResponse' }
            },
            '400' => {
              description: 'Bad Request',
              schema: { '$ref' => '#/definitions/ErrorResponse' }
            },
            '500' => {
              description: 'Internal Server Error',
              schema: { '$ref' => '#/definitions/ErrorResponse' }
            }
          }
        }
      },
      '/notifications/sms' => {
        post: {
          summary: 'Send SMS notification',
          description: 'Sends an SMS notification to the specified phone number',
          tags: ['SMS'],
          parameters: [{
            name: 'notification',
            in: 'body',
            required: true,
            schema: { '$ref' => '#/definitions/NotificationRequest' }
          }],
          responses: {
            '201' => {
              description: 'SMS sent successfully',
              schema: { '$ref' => '#/definitions/NotificationResponse' }
            },
            '400' => {
              description: 'Bad Request',
              schema: { '$ref' => '#/definitions/ErrorResponse' }
            },
            '500' => {
              description: 'Internal Server Error',
              schema: { '$ref' => '#/definitions/ErrorResponse' }
            }
          }
        }
      },
      '/notifications/push' => {
        post: {
          summary: 'Send push notification',
          description: 'Sends a push notification to the specified device',
          tags: ['Push'],
          parameters: [{
            name: 'notification',
            in: 'body',
            required: true,
            schema: { '$ref' => '#/definitions/NotificationRequest' }
          }],
          responses: {
            '201' => {
              description: 'Push notification sent successfully',
              schema: { '$ref' => '#/definitions/NotificationResponse' }
            },
            '400' => {
              description: 'Bad Request',
              schema: { '$ref' => '#/definitions/ErrorResponse' }
            },
            '500' => {
              description: 'Internal Server Error',
              schema: { '$ref' => '#/definitions/ErrorResponse' }
            }
          }
        }
      },
      '/notifications/bulk' => {
        post: {
          summary: 'Send bulk notifications',
          description: 'Sends multiple notifications in a single request',
          tags: ['Bulk'],
          parameters: [{
            name: 'bulk_request',
            in: 'body',
            required: true,
            schema: { '$ref' => '#/definitions/BulkNotificationRequest' }
          }],
          responses: {
            '202' => {
              description: 'Bulk notifications queued',
              schema: { '$ref' => '#/definitions/NotificationResponse' }
            },
            '400' => {
              description: 'Bad Request',
              schema: { '$ref' => '#/definitions/ErrorResponse' }
            },
            '500' => {
              description: 'Internal Server Error',
              schema: { '$ref' => '#/definitions/ErrorResponse' }
            }
          }
        }
      },
      '/notifications/{id}/status' => {
        get: {
          summary: 'Get notification status',
          description: 'Retrieves the status of a specific notification',
          tags: ['Status'],
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'Notification ID'
          }],
          responses: {
            '200' => {
              description: 'Notification status retrieved',
              schema: { '$ref' => '#/definitions/NotificationResponse' }
            },
            '404' => {
              description: 'Notification not found',
              schema: { '$ref' => '#/definitions/ErrorResponse' }
            },
            '500' => {
              description: 'Internal Server Error',
              schema: { '$ref' => '#/definitions/ErrorResponse' }
            }
          }
        }
      },
      '/health' => {
        get: {
          summary: 'Service health check',
          description: 'Returns the health status of the notification service',
          tags: ['Health'],
          responses: {
            '200' => {
              description: 'Service is healthy',
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'healthy' },
                  service: { type: 'string', example: 'notification-service' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        }
      }
    },
    definitions: {
      NotificationRequest: {
        type: 'object',
        required: ['type', 'recipient', 'message'],
        properties: {
          type: { type: 'string', enum: ['email', 'sms', 'push'], description: 'Notification type' },
          recipient: { type: 'string', description: 'Recipient identifier (email or phone)' },
          subject: { type: 'string', description: 'Subject line (required for email)' },
          message: { type: 'string', description: 'Message content' },
          template_id: { type: 'string', description: 'Template identifier (optional)' },
          template_data: { type: 'object', description: 'Template variables' }
        }
      },
      BulkNotificationRequest: {
        type: 'object',
        required: ['notifications'],
        properties: {
          notifications: {
            type: 'array',
            items: { '$ref' => '#/definitions/NotificationRequest' },
            description: 'Array of notification requests'
          }
        }
      },
      NotificationResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', description: 'Operation success status' },
          message: { type: 'string', description: 'Response message' },
          notification_id: { type: 'string', description: 'Created notification ID' },
          data: { type: 'object', description: 'Additional response data' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', description: 'Error message' },
          code: { type: 'string', description: 'Error code' },
          details: { type: 'object', description: 'Additional error details' }
        }
      }
    }
  }
  
  swagger_doc.to_json
end

get '/api/v1/docs' do
  content_type :html
  <<~HTML
    <!DOCTYPE html>
    <html>
      <head>
        <title>Notification Service API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
        <style>
          html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
          *, *:before, *:after { box-sizing: inherit; }
          body { margin:0; background: #fafafa; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            const ui = SwaggerUIBundle({
              url: "#{request.base_url}/api/v1/swagger.json",
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
              ],
              layout: "StandaloneLayout"
            });
          };
        </script>
      </body>
    </html>
  HTML
end
