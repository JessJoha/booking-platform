const Reservation = require('../model/reservationModel');

async function create(req, res) {
  try {
    const { userId, space, date, time, reason } = req.body;

    if (!userId || !space || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate allowed space types
    const allowedSpaces = ['Room', 'Sports Court'];
    if (!allowedSpaces.includes(space)) {
      return res.status(400).json({ message: 'The space type must be either Room or Sports Court' });
    }

    // Date validation (e.g., must not be a past date)
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return res.status(400).json({ message: 'The date must be today or a future date' });
    }

    const newReservation = await Reservation.create({
      userId,
      space,
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
