const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'External Integrations Service API',
    version: '1.0.0',
    description: 'External integrations microservice for the booking platform. Provides integration with third-party services including calendar systems, mapping services, weather APIs, and notification providers.',
    contact: {
      name: 'Booking Platform Team',
      email: 'admin@bookingplatform.com',
      url: 'https://www.bookingplatform.com'
    },
    license: {
      name: 'MIT',
      url: 'https://choosealicense.com/licenses/mit/'
    },
    termsOfService: 'https://www.bookingplatform.com/terms'
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3006}`,
      description: 'Development server'
    },
    {
      url: 'https://api.bookingplatform.com/external-integrations',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key'
      }
    },
    schemas: {
      CalendarEvent: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the calendar event',
            example: 'evt_123456'
          },
          title: {
            type: 'string',
            description: 'Title of the calendar event',
            example: 'Meeting Room Booking'
          },
          description: {
            type: 'string',
            description: 'Description of the calendar event',
            example: 'Team meeting in Conference Room A'
          },
          startTime: {
            type: 'string',
            format: 'date-time',
            description: 'Start time of the event',
            example: '2024-01-15T10:00:00Z'
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            description: 'End time of the event',
            example: '2024-01-15T11:00:00Z'
          },
          location: {
            type: 'string',
            description: 'Location of the event',
            example: 'Conference Room A'
          },
          attendees: {
            type: 'array',
            items: {
              type: 'string',
              format: 'email'
            },
            description: 'List of attendee email addresses',
            example: ['user1@example.com', 'user2@example.com']
          }
        },
        required: ['title', 'startTime', 'endTime']
      },
      LocationInfo: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'Full address of the location',
            example: '123 Main St, City, State 12345'
          },
          coordinates: {
            type: 'object',
            properties: {
              lat: {
                type: 'number',
                description: 'Latitude coordinate',
                example: 40.7128
              },
              lng: {
                type: 'number',
                description: 'Longitude coordinate',
                example: -74.0060
              }
            }
          },
          placeId: {
            type: 'string',
            description: 'Google Places ID',
            example: 'ChIJOwg_06VPwokRYv534QaPC8g'
          },
          name: {
            type: 'string',
            description: 'Name of the location',
            example: 'Central Park'
          }
        }
      },
      WeatherInfo: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'Location for weather information',
            example: 'New York, NY'
          },
          temperature: {
            type: 'number',
            description: 'Current temperature in Celsius',
            example: 22.5
          },
          condition: {
            type: 'string',
            description: 'Weather condition',
            example: 'Sunny'
          },
          humidity: {
            type: 'number',
            description: 'Humidity percentage',
            example: 65
          },
          windSpeed: {
            type: 'number',
            description: 'Wind speed in km/h',
            example: 10.5
          },
          forecast: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  format: 'date',
                  example: '2024-01-15'
                },
                temperature: {
                  type: 'object',
                  properties: {
                    min: { type: 'number', example: 15 },
                    max: { type: 'number', example: 25 }
                  }
                },
                condition: {
                  type: 'string',
                  example: 'Partly cloudy'
                }
              }
            }
          }
        }
      },
      NotificationPayload: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['email', 'sms', 'push', 'slack'],
            description: 'Type of notification',
            example: 'email'
          },
          recipient: {
            type: 'string',
            description: 'Recipient identifier (email, phone, user_id, etc.)',
            example: 'user@example.com'
          },
          subject: {
            type: 'string',
            description: 'Subject/title of the notification',
            example: 'Booking Confirmation'
          },
          message: {
            type: 'string',
            description: 'Content of the notification',
            example: 'Your booking has been confirmed for January 15, 2024.'
          },
          metadata: {
            type: 'object',
            description: 'Additional metadata for the notification',
            example: {
              bookingId: 'book_123',
              priority: 'high'
            }
          }
        },
        required: ['type', 'recipient', 'message']
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
            example: 'Invalid request parameters'
          },
          code: {
            type: 'string',
            description: 'Error code',
            example: 'INVALID_PARAMS'
          },
          details: {
            type: 'object',
            description: 'Additional error details'
          }
        }
      },
      HealthCheck: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['UP', 'DOWN'],
            description: 'Service health status',
            example: 'UP'
          },
          message: {
            type: 'string',
            description: 'Health check message',
            example: 'External Integrations Service is running'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp of the health check',
            example: '2024-01-15T10:00:00Z'
          },
          dependencies: {
            type: 'object',
            description: 'Status of external dependencies',
            example: {
              redis: 'UP',
              googleCalendar: 'UP',
              weatherAPI: 'UP'
            }
          }
        }
      }
    }
  },
  security: [
    {
      BearerAuth: []
    },
    {
      ApiKeyAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: [
    './src/routes/*.js',
    './server.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerSpec,
  swaggerUi
};
