const request = require('supertest');
const express = require('express');
const { deleteReservation } = require('../src/controller/deleteController');


const app = express();
app.use(express.json());
app.delete('/api/reservations/:id', deleteReservation);


jest.mock('../src/model/deleteModel', () => {
  return {
    Booking: {
      findByPk: jest.fn(),
    }
  };
});
jest.mock('../src/webhook/webhookClient', () => {
  return {
    sendOccupancyEvent: jest.fn()
  };
});

const { Booking } = require('../src/model/deleteModel');
const { sendOccupancyEvent } = require('../src/webhook/webhookClient');

describe('DELETE /api/reservations/:id', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('✅ should delete reservation successfully', async () => {
    const fakeReservation = {
      id: 1,
      spaceId: 123,
      date: '2025-07-06',
      destroy: jest.fn().mockResolvedValue()
    };

    Booking.findByPk.mockResolvedValue(fakeReservation);
    sendOccupancyEvent.mockResolvedValue();

    const response = await request(app).delete('/api/reservations/1');

    expect(Booking.findByPk).toHaveBeenCalledWith('1');
    expect(fakeReservation.destroy).toHaveBeenCalled();
    expect(sendOccupancyEvent).toHaveBeenCalledWith(123, '2025-07-06', 'deleted');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Reservation successfully cancelled.');
  });

  test('⚠️ should return 404 if reservation not found', async () => {
    Booking.findByPk.mockResolvedValue(null);

    const response = await request(app).delete('/api/reservations/999');

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Reservation not found');
  });

  test('should return 500 if an error occurs', async () => {
    Booking.findByPk.mockRejectedValue(new Error('DB error'));

    const response = await request(app).delete('/api/reservations/1');

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('Error deleting reservation');
  });
});
