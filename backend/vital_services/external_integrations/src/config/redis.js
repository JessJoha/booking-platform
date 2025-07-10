const redis = require('redis');
const logger = require('../utils/logger');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB || 0,
  retryDelayOnFailover: 100,
  enableOfflineQueue: false,
  lazyConnect: true
});

client.on('connect', () => {
  logger.info('Redis client connected');
});

client.on('error', (err) => {
  logger.error('Redis client error:', err);
});

client.on('end', () => {
  logger.info('Redis client disconnected');
});

// Connect to Redis
client.connect().catch((err) => {
  logger.error('Failed to connect to Redis:', err);
});

module.exports = client;
