const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Payment Gateway API',
      version: '1.0.0',
      description: 'gRPC-based payment processing microservice with multiple payment providers',
      contact: {
        name: 'Booking Platform Team',
        email: 'dev@bookingplatform.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3006',
        description: 'Development server'
      },
      {
        url: 'https://api.bookingplatform.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key'
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        PaymentRequest: {
          type: 'object',
          required: ['amount', 'currency', 'paymentMethod', 'bookingId'],
          properties: {
            amount: {
              type: 'number',
              format: 'double',
              description: 'Payment amount in smallest currency unit (e.g., cents)',
              example: 2500
            },
            currency: {
              type: 'string',
              description: 'ISO 4217 currency code',
              example: 'USD',
              enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
            },
            paymentMethod: {
              type: 'object',
              required: ['type'],
              properties: {
                type: {
                  type: 'string',
                  enum: ['stripe', 'paypal', 'mock'],
                  description: 'Payment provider type'
                },
                token: {
                  type: 'string',
                  description: 'Payment method token from provider'
                },
                paypalOrderId: {
                  type: 'string',
                  description: 'PayPal order ID (for PayPal payments)'
                }
              }
            },
            bookingId: {
              type: 'string',
              description: 'Associated booking identifier',
              example: 'booking_12345'
            },
            description: {
              type: 'string',
              description: 'Payment description',
              example: 'Conference Room A booking for 2 hours'
            },
            metadata: {
              type: 'object',
              description: 'Additional payment metadata'
            }
          }
        },
        PaymentResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Payment success status'
            },
            transactionId: {
              type: 'string',
              description: 'Unique transaction identifier'
            },
            paymentId: {
              type: 'string',
              description: 'Payment ID from provider'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'succeeded', 'failed', 'canceled'],
              description: 'Payment status'
            },
            amount: {
              type: 'number',
              format: 'double',
              description: 'Processed amount'
            },
            currency: {
              type: 'string',
              description: 'Payment currency'
            },
            provider: {
              type: 'string',
              description: 'Payment provider used'
            },
            providerResponse: {
              type: 'object',
              description: 'Raw response from payment provider'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Payment creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Payment last update timestamp'
            }
          }
        },
        RefundRequest: {
          type: 'object',
          required: ['transactionId'],
          properties: {
            transactionId: {
              type: 'string',
              description: 'Original transaction ID to refund'
            },
            amount: {
              type: 'number',
              format: 'double',
              description: 'Refund amount (optional, defaults to full amount)'
            },
            reason: {
              type: 'string',
              description: 'Refund reason',
              example: 'Customer requested cancellation'
            }
          }
        },
        RefundResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Refund success status'
            },
            refundId: {
              type: 'string',
              description: 'Unique refund identifier'
            },
            transactionId: {
              type: 'string',
              description: 'Original transaction ID'
            },
            amount: {
              type: 'number',
              format: 'double',
              description: 'Refunded amount'
            },
            status: {
              type: 'string',
              enum: ['pending', 'succeeded', 'failed', 'canceled'],
              description: 'Refund status'
            },
            provider: {
              type: 'string',
              description: 'Payment provider used'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Refund creation timestamp'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            },
            code: {
              type: 'string',
              description: 'Error code'
            },
            details: {
              type: 'object',
              description: 'Additional error details'
            }
          }
        },
        HealthStatus: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'healthy'
            },
            service: {
              type: 'string',
              example: 'payment-gateway'
            },
            version: {
              type: 'string',
              example: '1.0.0'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            uptime: {
              type: 'number',
              description: 'Service uptime in seconds'
            },
            providers: {
              type: 'object',
              properties: {
                stripe: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['available', 'unavailable'] },
                    lastCheck: { type: 'string', format: 'date-time' }
                  }
                },
                paypal: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', enum: ['available', 'unavailable'] },
                    lastCheck: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        ApiKeyAuth: []
      },
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./server.js', './src/routes/*.js', './src/services/*.js']
};

const specs = swaggerJSDoc(options);

module.exports = {
  specs,
  swaggerUi,
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Payment Gateway API Documentation'
  })
};
