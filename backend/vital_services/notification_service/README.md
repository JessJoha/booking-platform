# 📧 Notification Service

## Overview
Ruby-based microservice for handling multi-channel notifications (email, SMS, push notifications) in the Booking Platform ecosystem.

## Features
- **Multi-channel notifications**: Email, SMS, and push notifications
- **Template management**: Dynamic notification templates with variable substitution
- **Real-time notifications**: Redis-powered push notifications
- **Delivery tracking**: Monitor notification status and delivery results
- **Bulk operations**: Send notifications to multiple users
- **Error handling**: Comprehensive error tracking and retry mechanisms

## Tech Stack
- **Ruby 3.0** with Sinatra framework
- **PostgreSQL** for notification storage
- **Redis** for real-time push notifications
- **Twilio** for SMS delivery
- **SMTP** for email delivery
- **ActiveRecord** for database ORM

## API Endpoints

### Notifications
- `POST /notifications/send` - Send a notification
- `GET /notifications/:id` - Get notification details
- `GET /notifications/user/:user_id` - Get user notifications
- `GET /notifications/user/:user_id/push` - Get push notifications
- `PUT /notifications/:id/read` - Mark notification as read

### Templates
- `POST /templates` - Create notification template
- `GET /templates` - List notification templates

### Health Check
- `GET /health` - Service health status

## Usage Examples

### Send Email Notification
```bash
curl -X POST http://localhost:4006/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "123",
    "type": "email",
    "subject": "Booking Confirmation",
    "content": "Your booking has been confirmed for tomorrow at 3 PM.",
    "recipient": "user@example.com"
  }'
```

### Send SMS Notification
```bash
curl -X POST http://localhost:4006/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "123",
    "type": "sms",
    "subject": "Booking Reminder",
    "content": "Reminder: Your booking is in 1 hour.",
    "recipient": "+1234567890"
  }'
```

### Create Template
```bash
curl -X POST http://localhost:4006/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "booking_confirmation",
    "template_type": "email",
    "subject_template": "Booking Confirmation - {{space_name}}",
    "content_template": "Dear {{user_name}}, your booking for {{space_name}} on {{date}} has been confirmed."
  }'
```

## Environment Setup
1. Copy `.env.example` to `.env` and configure your settings
2. Install dependencies: `bundle install`
3. Create database: `bundle exec rake db:create db:migrate`
4. Start server: `ruby app.rb`

## Docker
```bash
# Build image
docker build -t notification-service .

# Run container
docker run -p 4006:4006 --env-file .env notification-service
```

## Integration with Other Services
This service integrates with:
- **User Management**: For user authentication and profile data
- **Reservation Management**: For booking-related notifications
- **Space Management**: For space-related notifications

## Dependencies
- Redis server for push notifications
- PostgreSQL database
- SMTP server for email delivery
- Twilio account for SMS delivery
