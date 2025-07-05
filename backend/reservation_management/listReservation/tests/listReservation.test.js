const request = require('supertest');
const express = require('express');
const { listAllReservations } = require('../src/controller/listController');


const app = express();
app.use(express.json());
app.get('/api/reservations', listAllReservations);


jest.mock('../src/model/listModel', () => {
  return {
    Booking: {
      findAll: jest.fn()
    }
  };
});

const { Booking } = require('../src/model/listModel');

describe('GET /api/reservations', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return all reservations', async () => {
    const mockData = [
      {
        id: 1,
        userId: 101,
        spaceId: 201,
        date: '2025-07-07',
        time: '09:00',
        reason: 'Fútbol'
      },
      {
        id: 2,
        userId: 102,
        spaceId: 202,
        date: '2025-07-08',
        time: '10:00',
        reason: 'Entrenamiento'
      }
    ];

    Booking.findAll.mockResolvedValue(mockData);

    const response = await request(app).get('/api/reservations');

    expect(Booking.findAll).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  test('should return 500 if there is an error', async () => {
    Booking.findAll.mockRejectedValue(new Error('DB Error'));

    const response = await request(app).get('/api/reservations');

    expect(Booking.findAll).toHaveBeenCalled();
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('Error retrieving reservations');
  });

});
