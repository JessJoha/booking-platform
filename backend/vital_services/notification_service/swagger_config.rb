require 'sinatra/swagger-exposer/swagger-exposer'

class NotificationSwagger < Sinatra::Base
  register Sinatra::SwaggerExposer

  general_info(
    version: '1.0.0',
    title: 'Notification Service API',
    description: 'Microservice for handling email, SMS, and push notifications',
    contact: {
      name: 'Booking Platform Team',
      email: 'dev@bookingplatform.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  )

  # Base URL configuration
  base_path '/api/v1'

  # Define common data types
  expose_type 'Notification' do |type|
    type.property :id, String, 'Unique notification identifier'
    type.property :type, String, 'Notification type (email, sms, push)', enum: %w[email sms push]
    type.property :recipient, String, 'Recipient identifier (email or phone)'
    type.property :subject, String, 'Subject line (for email notifications)'
    type.property :message, String, 'Notification message content'
    type.property :status, String, 'Delivery status', enum: %w[pending sent delivered failed]
    type.property :created_at, String, 'Creation timestamp'
    type.property :sent_at, String, 'Delivery timestamp'
  end

  expose_type 'NotificationRequest' do |type|
    type.property :type, String, 'Notification type', required: true, enum: %w[email sms push]
    type.property :recipient, String, 'Recipient identifier', required: true
    type.property :subject, String, 'Subject line (required for email)'
    type.property :message, String, 'Message content', required: true
    type.property :template_id, String, 'Template identifier (optional)'
    type.property :template_data, Object, 'Template variables'
  end

  expose_type 'BulkNotificationRequest' do |type|
    type.property :notifications, Array, 'Array of notification requests', required: true, items: { '$ref' => '#/definitions/NotificationRequest' }
  end

  expose_type 'NotificationResponse' do |type|
    type.property :success, TrueClass, 'Operation success status'
    type.property :message, String, 'Response message'
    type.property :notification_id, String, 'Created notification ID'
    type.property :data, Object, 'Additional response data'
  end

  expose_type 'ErrorResponse' do |type|
    type.property :success, FalseClass, 'Operation success status'
    type.property :error, String, 'Error message'
    type.property :code, String, 'Error code'
    type.property :details, Object, 'Additional error details'
  end

  # Common responses
  common_response 200, 'Success', 'NotificationResponse'
  common_response 400, 'Bad Request', 'ErrorResponse'
  common_response 401, 'Unauthorized', 'ErrorResponse'
  common_response 500, 'Internal Server Error', 'ErrorResponse'

  # Email notifications endpoints
  endpoint_summary 'Send email notification'
  endpoint_description 'Sends an email notification to the specified recipient'
  endpoint_tags ['Email']
  endpoint_parameter :notification, 'Notification data', :body, required: true, type: 'NotificationRequest'
  endpoint_response 201, 'Email sent successfully', 'NotificationResponse'
  post '/notifications/email' do
    # Implementation handled by main app
  end

  # SMS notifications endpoints
  endpoint_summary 'Send SMS notification'
  endpoint_description 'Sends an SMS notification to the specified phone number'
  endpoint_tags ['SMS']
  endpoint_parameter :notification, 'Notification data', :body, required: true, type: 'NotificationRequest'
  endpoint_response 201, 'SMS sent successfully', 'NotificationResponse'
  post '/notifications/sms' do
    # Implementation handled by main app
  end

  # Push notifications endpoints
  endpoint_summary 'Send push notification'
  endpoint_description 'Sends a push notification to the specified device'
  endpoint_tags ['Push']
  endpoint_parameter :notification, 'Notification data', :body, required: true, type: 'NotificationRequest'
  endpoint_response 201, 'Push notification sent successfully', 'NotificationResponse'
  post '/notifications/push' do
    # Implementation handled by main app
  end

  # Bulk notifications
  endpoint_summary 'Send bulk notifications'
  endpoint_description 'Sends multiple notifications in a single request'
  endpoint_tags ['Bulk']
  endpoint_parameter :bulk_request, 'Bulk notification data', :body, required: true, type: 'BulkNotificationRequest'
  endpoint_response 202, 'Bulk notifications queued', 'NotificationResponse'
  post '/notifications/bulk' do
    # Implementation handled by main app
  end

  # Get notification status
  endpoint_summary 'Get notification status'
  endpoint_description 'Retrieves the status of a specific notification'
  endpoint_tags ['Status']
  endpoint_parameter :id, 'Notification ID', :path, required: true, type: String
  endpoint_response 200, 'Notification status retrieved', 'NotificationResponse'
  get '/notifications/:id/status' do
    # Implementation handled by main app
  end

  # Get notification history
  endpoint_summary 'Get notification history'
  endpoint_description 'Retrieves notification history for a user'
  endpoint_tags ['History']
  endpoint_parameter :user_id, 'User ID', :query, required: true, type: String
  endpoint_parameter :type, 'Notification type filter', :query, type: String, enum: %w[email sms push]
  endpoint_parameter :limit, 'Number of results', :query, type: Integer, default: 50
  endpoint_parameter :offset, 'Pagination offset', :query, type: Integer, default: 0
  endpoint_response 200, 'Notification history retrieved'
  get '/notifications/history' do
    # Implementation handled by main app
  end

  # Template management
  endpoint_summary 'Create notification template'
  endpoint_description 'Creates a new notification template'
  endpoint_tags ['Templates']
  endpoint_parameter :template, 'Template data', :body, required: true
  endpoint_response 201, 'Template created successfully'
  post '/notifications/templates' do
    # Implementation handled by main app
  end

  endpoint_summary 'Get notification templates'
  endpoint_description 'Retrieves all notification templates'
  endpoint_tags ['Templates']
  endpoint_response 200, 'Templates retrieved successfully'
  get '/notifications/templates' do
    # Implementation handled by main app
  end

  # Health check
  endpoint_summary 'Service health check'
  endpoint_description 'Returns the health status of the notification service'
  endpoint_tags ['Health']
  endpoint_response 200, 'Service is healthy'
  get '/health' do
    # Implementation handled by main app
  end
end
