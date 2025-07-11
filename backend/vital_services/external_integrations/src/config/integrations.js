module.exports = {
  // Google Calendar API configuration
  googleCalendar: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]
  },

  // Microsoft Outlook/Office 365 configuration
  microsoftCalendar: {
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    tenantId: process.env.MICROSOFT_TENANT_ID,
    redirectUri: process.env.MICROSOFT_REDIRECT_URI,
    scopes: ['https://graph.microsoft.com/calendars.readwrite']
  },

  // Google Maps API configuration
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
    baseUrl: 'https://maps.googleapis.com/maps/api'
  },

  // OpenWeatherMap API configuration
  weather: {
    apiKey: process.env.OPENWEATHER_API_KEY,
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    units: 'metric'
  },

  // Twilio configuration for SMS
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },

  // SendGrid configuration for email
  sendGrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL
  },

  // Cache configuration
  cache: {
    defaultTtl: 3600, // 1 hour
    weatherTtl: 1800, // 30 minutes
    mapsTtl: 86400,   // 24 hours
    calendarTtl: 300  // 5 minutes
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};
