# External Integrations Service

A comprehensive microservice for managing external API integrations in the booking platform, including calendar synchronization, maps services, weather data, and notification systems.

## Features

### 🗓️ Calendar Integration
- **Google Calendar API** integration for event management
- **Microsoft Outlook/Office 365** support
- Calendar event creation, updating, and deletion
- Conflict detection and resolution
- iCal file generation for cross-platform compatibility
- Automatic sync queue management

### 🗺️ Maps & Location Services
- **Google Maps API** integration
- Address geocoding and reverse geocoding
- Distance and duration calculations
- Nearby places search with filtering
- Place details and photo retrieval
- Static map generation
- Route optimization for multiple destinations

### 🌤️ Weather Data
- **OpenWeatherMap API** integration
- Current weather conditions
- 5-day weather forecasts
- Weather alerts and warnings
- Activity suitability analysis
- Multi-location weather comparison
- Air quality information (mock implementation)

### 📱 Notification System
- **SMS notifications** via Twilio
- **Email notifications** via SendGrid
- Booking confirmation and reminder notifications
- Weather alert notifications
- Bulk notification processing
- Template rendering system

### 🔄 Synchronization Services
- Asynchronous sync queue management
- Calendar event synchronization
- Retry mechanism for failed operations
- Batch processing capabilities
- Sync status tracking

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Caching**: Redis
- **Validation**: Joi
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **APIs**: Google Calendar, Google Maps, OpenWeatherMap, Twilio, SendGrid

## API Endpoints

### Calendar Routes (`/api/v1/calendar`)
- `GET /auth-url` - Get OAuth authorization URL
- `POST /auth/callback` - Handle OAuth callback
- `POST /events` - Create calendar event
- `PUT /events/:eventId` - Update calendar event
- `DELETE /events/:eventId` - Delete calendar event
- `GET /events` - Get user's calendar events
- `POST /conflicts/check` - Check for calendar conflicts
- `POST /ical/generate` - Generate iCal file
- `POST /import` - Import user's calendar events

### Maps Routes (`/api/v1/maps`)
- `POST /geocode` - Geocode address to coordinates
- `POST /reverse-geocode` - Reverse geocode coordinates
- `POST /distance` - Calculate distance matrix
- `GET /nearby` - Find nearby places
- `GET /place/:placeId` - Get place details
- `GET /static-map` - Generate static map URL
- `POST /route-optimization` - Optimize route for multiple destinations
- `GET /places/autocomplete` - Get place suggestions

### Weather Routes (`/api/v1/weather`)
- `GET /current` - Get current weather
- `GET /forecast` - Get weather forecast
- `POST /multiple` - Get weather for multiple locations
- `GET /alerts` - Get weather alerts
- `GET /activity-suitability` - Check weather suitability
- `GET /historical` - Get historical weather data
- `GET /air-quality` - Get air quality information
- `POST /compare` - Compare weather between locations

### Notification Routes (`/api/v1/notifications`)
- `POST /sms` - Send SMS notification
- `POST /email` - Send email notification
- `POST /booking/confirmation` - Send booking confirmation
- `POST /booking/reminder` - Send booking reminder
- `POST /booking/cancellation` - Send booking cancellation
- `POST /weather/alert` - Send weather alert
- `POST /bulk` - Send bulk notifications
- `POST /test` - Test notification services
- `GET /status` - Get notification service status

### Sync Routes (`/api/v1/sync`)
- `POST /calendar/create` - Queue calendar creation sync
- `POST /calendar/update` - Queue calendar update sync
- `POST /calendar/delete` - Queue calendar deletion sync
- `GET /status/:bookingId` - Get sync status
- `POST /force-resync/:bookingId` - Force resync
- `GET /queue/status` - Get sync queue status
- `POST /calendar/import` - Import calendar events
- `POST /batch` - Queue multiple sync operations

## Installation & Setup

### Prerequisites
- Node.js 18 or higher
- Redis server
- API keys for external services

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd external_integrations

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env with your API keys and configuration
nano .env
```

### Environment Variables
```env
# Server Configuration
NODE_ENV=development
PORT=3009

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Google Calendar API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3009/api/v1/calendar/auth/callback

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Weather API
OPENWEATHER_API_KEY=your_openweather_api_key

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid (Email)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### Running the Service
```bash
# Development mode
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run linting
npm run lint
```

### Docker Deployment
```bash
# Build Docker image
docker build -t external-integrations .

# Run container
docker run -d \
  --name external-integrations \
  -p 3009:3009 \
  --env-file .env \
  external-integrations
```

## Usage Examples

### Calendar Integration
```javascript
// Get authorization URL
const authResponse = await fetch('/api/v1/calendar/auth-url');
const { authUrl } = await authResponse.json();

// Create calendar event
const eventData = {
  eventData: {
    title: 'Meeting Room Booking',
    description: 'Team meeting in Conference Room A',
    startTime: '2024-01-15T14:00:00Z',
    endTime: '2024-01-15T15:00:00Z',
    location: 'Conference Room A, Building 1',
    timezone: 'America/New_York'
  },
  userTokens: {
    access_token: 'user_access_token',
    refresh_token: 'user_refresh_token'
  }
};

const response = await fetch('/api/v1/calendar/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(eventData)
});
```

### Maps & Location Services
```javascript
// Geocode an address
const geocodeResponse = await fetch('/api/v1/maps/geocode', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: '1600 Amphitheatre Parkway, Mountain View, CA' })
});

// Find nearby restaurants
const nearbyResponse = await fetch('/api/v1/maps/nearby?lat=37.4419&lng=-122.1419&type=restaurant&radius=1000');
```

### Weather Services
```javascript
// Get current weather
const weatherResponse = await fetch('/api/v1/weather/current?lat=40.7128&lng=-74.0060');

// Check activity suitability
const suitabilityResponse = await fetch('/api/v1/weather/activity-suitability?lat=40.7128&lng=-74.0060&activityType=outdoor');
```

### Notifications
```javascript
// Send booking confirmation
const confirmationData = {
  booking: {
    bookingId: 'booking_123',
    confirmationNumber: 'CONF123456',
    userName: 'John Doe',
    spaceName: 'Conference Room A',
    date: '2024-01-15',
    time: '2:00 PM',
    location: 'Building 1, Floor 2'
  },
  userContact: {
    email: 'john.doe@example.com',
    phone: '+1234567890'
  }
};

const response = await fetch('/api/v1/notifications/booking/confirmation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(confirmationData)
});
```

## Architecture

### Service Design
- **Microservice Architecture**: Standalone service with clear API boundaries
- **Event-Driven**: Asynchronous processing with queue management
- **Caching Strategy**: Redis caching for API responses and rate limiting
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Logging**: Structured logging with Winston for debugging and monitoring

### External Dependencies
- **Google Calendar API**: OAuth2 authentication and calendar management
- **Google Maps API**: Geocoding, places, and distance calculations
- **OpenWeatherMap API**: Weather data and forecasts
- **Twilio API**: SMS notifications
- **SendGrid API**: Email notifications
- **Redis**: Caching and session management

### Security Features
- **API Key Validation**: Configurable API key authentication
- **Rate Limiting**: Configurable rate limiting per endpoint
- **Input Validation**: Comprehensive request validation with Joi
- **Error Sanitization**: Safe error messages without sensitive data exposure

## Testing

### Test Suite
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Categories
- **Integration Tests**: API endpoint testing
- **Unit Tests**: Service and utility function testing
- **Error Handling**: Validation and error scenario testing

## Monitoring & Observability

### Health Checks
- Service health endpoint: `GET /health`
- Sync queue status: `GET /api/v1/sync/queue/status`
- Notification service status: `GET /api/v1/notifications/status`

### Logging
- Structured JSON logging in production
- Configurable log levels
- Error and access log separation

### Metrics (Future Enhancement)
- API response times
- Cache hit/miss ratios
- External API success rates
- Queue processing metrics

## Development

### Code Structure
```
src/
├── config/          # Configuration files
├── routes/          # API route handlers
├── services/        # Business logic services
└── utils/           # Utility functions and middleware
```

### Contributing
1. Follow the existing code style and patterns
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Use semantic commit messages

### Best Practices
- **Error Handling**: Always handle and log errors appropriately
- **Caching**: Cache expensive operations and API calls
- **Validation**: Validate all inputs at the API boundary
- **Logging**: Log important operations and errors
- **Rate Limiting**: Respect external API rate limits

## Performance Considerations

### Caching Strategy
- **API Response Caching**: Cache external API responses with appropriate TTL
- **Rate Limiting**: Prevent abuse and respect external API limits
- **Connection Pooling**: Reuse connections for external APIs

### Scalability
- **Horizontal Scaling**: Stateless design allows for multiple instances
- **Queue Management**: Asynchronous processing prevents blocking
- **Database Optimization**: Efficient Redis usage for caching

## Future Enhancements

### Planned Features
- Microsoft Graph API integration for Outlook/Office 365
- Slack/Teams notification integration
- More weather data providers
- Advanced route optimization algorithms
- Real-time notification delivery status
- Webhook support for external integrations

### Technical Improvements
- Metrics and monitoring dashboard
- Advanced retry strategies
- Circuit breaker pattern implementation
- API versioning strategy
- OpenAPI/Swagger documentation

## Support

For questions, issues, or contributions, please refer to the project documentation or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
