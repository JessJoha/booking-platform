# 📝 Review Management Service

## Overview
Comprehensive review and rating management system for the Booking Platform, providing features for user reviews, business responses, moderation, and analytics.

## Features
- **Review Management**: Create, read, update, delete reviews
- **Rating System**: 5-star rating with aggregated metrics
- **Business Responses**: Business owners can respond to reviews
- **Content Moderation**: Automated and manual review moderation
- **Review Analytics**: Insights and trends analysis
- **Tag System**: Categorize reviews with tags
- **Image Support**: Attach images to reviews
- **Reporting System**: Report inappropriate content
- **Helpfulness Voting**: Users can vote on review helpfulness

## Tech Stack
- **Go 1.23** with Gin framework
- **PostgreSQL** for data persistence
- **GORM** for database ORM
- **Swagger** for API documentation
- **JWT** for authentication
- **Docker** for containerization

## API Endpoints

### Reviews
- `POST /api/v1/reviews` - Create a new review
- `GET /api/v1/reviews` - Get reviews with filtering
- `GET /api/v1/reviews/{id}` - Get specific review
- `PUT /api/v1/reviews/{id}` - Update review
- `DELETE /api/v1/reviews/{id}` - Delete review
- `POST /api/v1/reviews/{id}/helpful` - Mark review as helpful
- `POST /api/v1/reviews/{id}/report` - Report review

### Ratings
- `GET /api/v1/ratings/space/{space_id}` - Get space rating metrics
- `GET /api/v1/ratings/space/{space_id}/summary` - Get rating summary

### Moderation
- `GET /api/v1/moderation/reports` - Get review reports
- `PUT /api/v1/moderation/reviews/{id}` - Moderate review
- `GET /api/v1/moderation/queue` - Get moderation queue

### Analytics
- `GET /api/v1/analytics/reviews` - Review analytics
- `GET /api/v1/analytics/ratings` - Rating trends
- `GET /api/v1/analytics/sentiment` - Sentiment analysis

## Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=review_management

# Server
PORT=4007
GIN_MODE=release

# JWT
JWT_SECRET=your-jwt-secret

# External Services
USER_SERVICE_URL=http://localhost:5000
SPACE_SERVICE_URL=http://localhost:4000
NOTIFICATION_SERVICE_URL=http://localhost:4006
```

## Getting Started

1. **Clone and setup**:
   ```bash
   cd backend/review_management
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Install dependencies**:
   ```bash
   go mod download
   ```

3. **Run migrations**:
   ```bash
   go run main.go
   ```

4. **Start development server**:
   ```bash
   go run main.go
   ```

5. **View API documentation**:
   ```
   http://localhost:4007/swagger/index.html
   ```

## Docker Deployment
```bash
docker build -t review-management .
docker run -p 4007:4007 --env-file .env review-management
```

## Integration Points
- **User Management**: User authentication and profile validation
- **Space Management**: Space information and validation
- **Notification Service**: Review notifications and alerts
- **Booking Management**: Booking verification for reviews
