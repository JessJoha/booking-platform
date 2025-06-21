const { Booking } = require('../model/reservationModel');

async function create(req, res) {
  try {
    const { userId, spaceId, date, time, reason } = req.body;

    if (!userId || !spaceId || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return res.status(400).json({ message: 'The date must be today or a future date' });
    }

    
    const newReservation = await Booking.create({
      userId,
      spaceId,
      date,
      time,
      reason
    });

    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Error saving the reservation' });
  }
}

module.exports = { create };
  