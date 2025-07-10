const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const cron = require('node-cron');
const logger = require('./src/utils/logger');
const redis = require('./src/config/redis');
const { swaggerSpec, swaggerUi } = require('./src/config/swagger');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3009;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'External Integrations API Documentation'
}));

// OpenAPI JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api/v1/calendar', require('./src/routes/calendar'));
app.use('/api/v1/maps', require('./src/routes/maps'));
app.use('/api/v1/weather', require('./src/routes/weather'));
app.use('/api/v1/notifications', require('./src/routes/notifications'));
app.use('/api/v1/sync', require('./src/routes/sync'));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the external integrations service and its dependencies
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *             example:
 *               status: "UP"
 *               message: "External Integrations Service is running"
 *               timestamp: "2024-01-15T10:00:00Z"
 *               dependencies:
 *                 redis: "UP"
 *                 googleCalendar: "UP"
 *                 weatherAPI: "UP"
 *       500:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'External Integrations Service is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    dependencies: {
      redis: 'UP',
      googleCalendar: 'UP',
      weatherAPI: 'UP'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource was not found'
  });
});

// Scheduled tasks
cron.schedule('0 */6 * * *', () => {
  logger.info('Running scheduled calendar sync');
  require('./src/services/syncService').syncAllCalendars();
});

cron.schedule('0 8 * * *', () => {
  logger.info('Running daily weather update');
  require('./src/services/weatherService').updateDailyForecasts();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await redis.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await redis.quit();
  process.exit(0);
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`External Integrations Service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server };
