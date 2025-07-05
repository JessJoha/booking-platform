const request = require('supertest');
const express = require('express');
const reservationRoutes = require('../src/routes/reservationRoutes');
const { Booking } = require('../src/model/reservationModel');
const verifyToken = require('../src/middleware/auth');
const webhookClient = require('../src/webhook/webhookClient');


const app = express();
app.use(express.json());
app.use('/', reservationRoutes);


jest.mock('../src/middleware/auth', () => jest.fn((req, res, next) => next()));


jest.mock('../src/webhook/webhookClient', () => ({
  sendWebhookEvent: jest.fn(),
}));

// Mock del modelo Booking
jest.mock('../src/model/reservationModel', () => {
  const originalModule = jest.requireActual('../src/model/reservationModel');
  return {
    ...originalModule,
    Booking: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  };
});

describe('POST /reservations', () => {
  const validReservation = {
    userId: 1,
    spaceId: 101,
    date: new Date().toISOString().split('T')[0], // hoy
    time: '10:00',
    reason: 'Practice match'
  };

  it('should create a reservation successfully', async () => {
    Booking.findOne.mockResolvedValue(null);
    Booking.create.mockResolvedValue({ id: 1, ...validReservation });

    const response = await request(app)
      .post('/reservations')
      .set('Authorization', 'Bearer fake-token')
      .send(validReservation);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(Booking.findOne).toHaveBeenCalled();
    expect(Booking.create).toHaveBeenCalled();
    expect(webhookClient.sendWebhookEvent).toHaveBeenCalled();
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/reservations')
      .set('Authorization', 'Bearer fake-token')
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Missing required fields');
  });

  it('should return 409 if reservation already exists', async () => {
    Booking.findOne.mockResolvedValue({ id: 99 });

    const response = await request(app)
      .post('/reservations')
      .set('Authorization', 'Bearer fake-token')
      .send(validReservation);

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toMatch(/already booked/i);
  });

  it('should return 400 if date is in the past', async () => {
    const response = await request(app)
      .post('/reservations')
      .set('Authorization', 'Bearer fake-token')
      .send({ ...validReservation, date: '2000-01-01' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/date must be today or a future date/i);
  });

  it('should return 500 on unexpected error', async () => {
    Booking.findOne.mockImplementation(() => { throw new Error('DB fail') });

    const response = await request(app)
      .post('/reservations')
      .set('Authorization', 'Bearer fake-token')
      .send(validReservation);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch(/error creating reservation/i);
  });
});
