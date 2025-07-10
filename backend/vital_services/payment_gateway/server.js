const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { specs, swaggerUi } = require('./swagger');
require('dotenv').config();

// Database connection
require('./config/database');

// Create Express app for REST API documentation
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/api/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the payment gateway service
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthStatus'
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'payment-gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    grpc: {
      port: process.env.GRPC_PORT || 50051,
      status: 'running'
    },
    providers: {
      stripe: {
        status: process.env.STRIPE_SECRET_KEY ? 'available' : 'unavailable',
        lastCheck: new Date().toISOString()
      },
      paypal: {
        status: process.env.PAYPAL_CLIENT_ID ? 'available' : 'unavailable',
        lastCheck: new Date().toISOString()
      }
    }
  });
});

// Start Express server for documentation
const HTTP_PORT = process.env.HTTP_PORT || 3006;
app.listen(HTTP_PORT, () => {
  console.log(`Payment Gateway HTTP server (docs) running on port ${HTTP_PORT}`);
  console.log(`Swagger documentation available at http://localhost:${HTTP_PORT}/api/docs`);
});

// Load the protobuf
const PROTO_PATH = path.join(__dirname, 'proto', 'payment.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const paymentProto = grpc.loadPackageDefinition(packageDefinition).payment;

// Import services
const PaymentService = require('./services/PaymentService');
const logger = require('./utils/logger');

// Initialize payment service
const paymentService = new PaymentService();

// gRPC service implementation
const server = new grpc.Server();

server.addService(paymentProto.PaymentService.service, {
    ProcessPayment: async (call, callback) => {
        try {
            logger.info('Processing payment request', { 
                userId: call.request.user_id,
                bookingId: call.request.booking_id,
                amount: call.request.amount 
            });

            const result = await paymentService.processPayment(call.request);
            callback(null, result);
        } catch (error) {
            logger.error('Error processing payment', error);
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    },

    GetPaymentStatus: async (call, callback) => {
        try {
            logger.info('Getting payment status', { transactionId: call.request.transaction_id });

            const result = await paymentService.getPaymentStatus(call.request);
            callback(null, result);
        } catch (error) {
            logger.error('Error getting payment status', error);
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    },

    RefundPayment: async (call, callback) => {
        try {
            logger.info('Processing refund request', { 
                transactionId: call.request.transaction_id,
                amount: call.request.amount 
            });

            const result = await paymentService.refundPayment(call.request);
            callback(null, result);
        } catch (error) {
            logger.error('Error processing refund', error);
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    },

    GetPaymentHistory: async (call, callback) => {
        try {
            logger.info('Getting payment history', { userId: call.request.user_id });

            const result = await paymentService.getPaymentHistory(call.request);
            callback(null, result);
        } catch (error) {
            logger.error('Error getting payment history', error);
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    },

    ValidatePaymentMethod: async (call, callback) => {
        try {
            logger.info('Validating payment method', { method: call.request.payment_method });

            const result = await paymentService.validatePaymentMethod(call.request);
            callback(null, result);
        } catch (error) {
            logger.error('Error validating payment method', error);
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    },

    GetSupportedMethods: async (call, callback) => {
        try {
            logger.info('Getting supported payment methods');

            const result = await paymentService.getSupportedMethods();
            callback(null, result);
        } catch (error) {
            logger.error('Error getting supported methods', error);
            callback({
                code: grpc.status.INTERNAL,
                details: error.message
            });
        }
    }
});

// Start the server
const PORT = process.env.GRPC_PORT || 50051;
const HOST = process.env.GRPC_HOST || '0.0.0.0';

server.bindAsync(
    `${HOST}:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            logger.error('Failed to start gRPC server', error);
            process.exit(1);
        }
        
        logger.info(`Payment Gateway gRPC server running on ${HOST}:${port}`);
        server.start();
    }
);

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down gracefully');
    server.tryShutdown((error) => {
        if (error) {
            logger.error('Error during shutdown', error);
            process.exit(1);
        }
        logger.info('Server shut down successfully');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down gracefully');
    server.tryShutdown((error) => {
        if (error) {
            logger.error('Error during shutdown', error);
            process.exit(1);
        }
        logger.info('Server shut down successfully');
        process.exit(0);
    });
});
