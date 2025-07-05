
const request = require('supertest');
const app = require('../server'); 

describe('GET /api/reports/user/:userId', () => {
  it('should return reservations for a valid userId', async () => {
    const res = await request(app).get('/api/reports/user/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('reservations');
  });
});
