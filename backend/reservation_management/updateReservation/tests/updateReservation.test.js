

const request = require('supertest');
const express = require('express');
const { updateReservation } = require('../src/controller/updateController');

const app = express();
app.use(express.json());
app.put('/api/reservations/:id', updateReservation);


jest.mock('../src/model/updateModel', () => ({
  Booking: {
    findByPk: jest.fn()
  }
}));

jest.mock('../src/webhook/webhookClient', () => ({
  sendOccupancyEvent: jest.fn()
}));

const { Booking } = require('../src/model/updateModel');
const { sendOccupancyEvent } = require('../src/webhook/webhookClient');

describe('PUT /api/reservations/:id', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should update reservation and send correct occupancy events', async () => {
    const fakeReservation = {
      id: 1,
      spaceId: 10,
      date: '2025-07-07',
      time: '08:00',
      reason: 'Practice',
      save: jest.fn().mockResolvedValue()
    };

    Booking.findByPk.mockResolvedValue(fakeReservation);
    sendOccupancyEvent.mockResolvedValue();

    const response = await request(app)
      .put('/api/reservations/1')
      .send({
        date: '2025-07-08',
        time: '09:00',
        reason: 'Changed Reason',
        spaceId: 20
      });

    expect(Booking.findByPk).toHaveBeenCalledWith('1');
    expect(fakeReservation.save).toHaveBeenCalled();
    expect(sendOccupancyEvent).toHaveBeenCalledWith(10, '2025-07-07', 'deleted');
    expect(sendOccupancyEvent).toHaveBeenCalledWith(20, '2025-07-08', 'created');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Reservation updated successfully');
  });

  test('⚠️ should send "updated" event if spaceId and date are unchanged', async () => {
    const fakeReservation = {
      id: 2,
      spaceId: 5,
      date: '2025-07-10',
      time: '10:00',
      reason: 'Original',
      save: jest.fn().mockResolvedValue()
    };

    Booking.findByPk.mockResolvedValue(fakeReservation);
    sendOccupancyEvent.mockResolvedValue();

    const response = await request(app)
      .put('/api/reservations/2')
      .send({
        reason: 'Updated Reason'
      });

    expect(sendOccupancyEvent).toHaveBeenCalledWith(5, '2025-07-10', 'updated');
    expect(response.statusCode).toBe(200);
  });

  test('should return 404 if reservation not found', async () => {
    Booking.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .put('/api/reservations/999')
      .send({ reason: 'Anything' });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Reservation not found');
  });

  test('should return 500 on server error', async () => {
    Booking.findByPk.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .put('/api/reservations/1')
      .send({});

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('Error updating reservation');
  });

});
