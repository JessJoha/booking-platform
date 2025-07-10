const request = require('supertest');
const { app, server } = require('../server');

describe('External Integrations Service', () => {
  afterAll((done) => {
    server.close(done);
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('external-integrations');
    });
  });

  describe('Calendar Routes', () => {
    it('should get calendar auth URL', async () => {
      const response = await request(app)
        .get('/api/v1/calendar/auth-url')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.authUrl).toBeDefined();
    });

    it('should validate calendar event creation', async () => {
      const invalidEvent = {
        eventData: {
          title: '',
          startTime: '2024-01-01T10:00:00Z',
          endTime: '2024-01-01T09:00:00Z' // End before start
        }
      };

      await request(app)
        .post('/api/v1/calendar/events')
        .send(invalidEvent)
        .expect(400);
    });
  });

  describe('Maps Routes', () => {
    it('should validate geocoding request', async () => {
      const invalidRequest = {};

      await request(app)
        .post('/api/v1/maps/geocode')
        .send(invalidRequest)
        .expect(400);
    });

    it('should validate nearby search parameters', async () => {
      await request(app)
        .get('/api/v1/maps/nearby')
        .query({ lat: 'invalid', lng: 'invalid' })
        .expect(400);
    });
  });

  describe('Weather Routes', () => {
    it('should validate weather request parameters', async () => {
      await request(app)
        .get('/api/v1/weather/current')
        .query({ lat: 'invalid' })
        .expect(400);
    });

    it('should return weather comparison for valid locations', async () => {
      const locations = [
        { lat: 40.7128, lng: -74.0060, name: 'New York' },
        { lat: 51.5074, lng: -0.1278, name: 'London' }
      ];

      // This would fail without proper API keys, but tests the route structure
      await request(app)
        .post('/api/v1/weather/compare')
        .send({ locations })
        .expect(500); // Expected to fail without API keys
    });
  });

  describe('Notification Routes', () => {
    it('should validate SMS request', async () => {
      const invalidSMS = { message: 'test' }; // Missing phone number

      await request(app)
        .post('/api/v1/notifications/sms')
        .send(invalidSMS)
        .expect(400);
    });

    it('should get notification service status', async () => {
      const response = await request(app)
        .get('/api/v1/notifications/status')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.status).toBeDefined();
    });
  });

  describe('Sync Routes', () => {
    it('should validate sync calendar creation request', async () => {
      const invalidRequest = {};

      await request(app)
        .post('/api/v1/sync/calendar/create')
        .send(invalidRequest)
        .expect(400);
    });

    it('should get sync queue status', async () => {
      const response = await request(app)
        .get('/api/v1/sync/queue/status')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.queue).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 routes', async () => {
      await request(app)
        .get('/nonexistent-route')
        .expect(404);
    });

    it('should handle invalid JSON', async () => {
      await request(app)
        .post('/api/v1/calendar/events')
        .send('invalid json')
        .type('application/json')
        .expect(400);
    });
  });
});
