const Joi = require('joi');

/**
 * Validate calendar event data
 */
const validateCalendarEvent = (req, res, next) => {
  const schema = Joi.object({
    eventData: Joi.object({
      title: Joi.string().required().min(1).max(200),
      description: Joi.string().allow('').max(1000),
      startTime: Joi.string().isoDate().required(),
      endTime: Joi.string().isoDate().required(),
      location: Joi.string().allow('').max(500),
      timezone: Joi.string().default('UTC'),
      attendees: Joi.array().items(Joi.string().email()).default([])
    }).required(),
    userTokens: Joi.object({
      access_token: Joi.string().required(),
      refresh_token: Joi.string(),
      scope: Joi.string(),
      token_type: Joi.string(),
      expiry_date: Joi.number()
    }).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }

  // Validate that end time is after start time
  const { startTime, endTime } = req.body.eventData;
  if (new Date(endTime) <= new Date(startTime)) {
    return res.status(400).json({
      success: false,
      error: 'End time must be after start time'
    });
  }

  next();
};

/**
 * Validate calendar import request
 */
const validateCalendarImport = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    userTokens: Joi.object({
      access_token: Joi.string().required(),
      refresh_token: Joi.string(),
      scope: Joi.string(),
      token_type: Joi.string(),
      expiry_date: Joi.number()
    }).required(),
    dateRange: Joi.object({
      start: Joi.string().isoDate().required(),
      end: Joi.string().isoDate().required()
    }).default({
      start: new Date().toISOString(),
      end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }

  next();
};

/**
 * Validate geocoding request
 */
const validateGeocode = (req, res, next) => {
  const schema = Joi.object({
    address: Joi.string().required().min(1).max(500)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }

  next();
};

/**
 * Validate nearby search request
 */
const validateNearbySearch = (req, res, next) => {
  const schema = Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    type: Joi.string().default('restaurant'),
    radius: Joi.number().min(1).max(50000).default(1500)
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }

  next();
};

/**
 * Validate weather request
 */
const validateWeatherRequest = (req, res, next) => {
  const schema = Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    days: Joi.number().min(1).max(10).default(5),
    activityType: Joi.string().valid('general', 'outdoor', 'sports', 'hiking', 'beach').default('general')
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }

  next();
};

/**
 * Validate notification request
 */
const validateNotification = (req, res, next) => {
  const schema = Joi.object({
    booking: Joi.object({
      bookingId: Joi.string().required(),
      confirmationNumber: Joi.string().required(),
      userName: Joi.string().required(),
      spaceName: Joi.string().required(),
      date: Joi.string().required(),
      time: Joi.string().required(),
      duration: Joi.string(),
      location: Joi.string().required(),
      contactInfo: Joi.string()
    }).required(),
    userContact: Joi.object({
      email: Joi.string().email().allow(''),
      phone: Joi.string().allow('')
    }).required(),
    hoursUntil: Joi.number().min(0),
    reason: Joi.string()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }

  // Validate that at least one contact method is provided
  const { userContact } = req.body;
  if (!userContact.email && !userContact.phone) {
    return res.status(400).json({
      success: false,
      error: 'At least one contact method (email or phone) is required'
    });
  }

  next();
};

/**
 * Validate bulk notifications request
 */
const validateBulkNotifications = (req, res, next) => {
  const schema = Joi.object({
    notifications: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        type: Joi.string().valid('email', 'sms').required(),
        to: Joi.string().required(),
        subject: Joi.string().when('type', {
          is: 'email',
          then: Joi.required(),
          otherwise: Joi.forbidden()
        }),
        content: Joi.string().when('type', {
          is: 'email',
          then: Joi.required(),
          otherwise: Joi.forbidden()
        }),
        message: Joi.string().when('type', {
          is: 'sms',
          then: Joi.required(),
          otherwise: Joi.forbidden()
        }),
        isHtml: Joi.boolean().default(false)
      })
    ).min(1).max(100).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }

  next();
};

/**
 * Validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().valid('asc', 'desc').default('asc'),
    sortBy: Joi.string().default('timestamp')
  });

  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }

  req.pagination = value;
  next();
};

/**
 * Validate date range
 */
const validateDateRange = (req, res, next) => {
  const schema = Joi.object({
    startDate: Joi.string().isoDate().required(),
    endDate: Joi.string().isoDate().required()
  });

  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.details[0].message
    });
  }

  // Validate that end date is after start date
  const { startDate, endDate } = req.query;
  if (new Date(endDate) <= new Date(startDate)) {
    return res.status(400).json({
      success: false,
      error: 'End date must be after start date'
    });
  }

  // Validate that date range is not too large (max 1 year)
  const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
  if (new Date(endDate) - new Date(startDate) > maxRange) {
    return res.status(400).json({
      success: false,
      error: 'Date range cannot exceed 1 year'
    });
  }

  next();
};

/**
 * Validate API key
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required'
    });
  }

  // In a real application, you would validate against stored API keys
  const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  if (validApiKeys.length > 0 && !validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API key'
    });
  }

  next();
};

/**
 * Rate limiting middleware
 */
const rateLimit = require('express-rate-limit');
const createRateLimit = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options
  });
};

module.exports = {
  validateCalendarEvent,
  validateCalendarImport,
  validateGeocode,
  validateNearbySearch,
  validateWeatherRequest,
  validateNotification,
  validateBulkNotifications,
  validatePagination,
  validateDateRange,
  validateApiKey,
  createRateLimit
};
