const { Booking } = require('../model/listModel');

const listAllReservations = async (req, res) => {
  try {
    const reservations = await Booking.findAll();
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error retrieving reservations:', error.message);
    res.status(500).json({ message: 'Error retrieving reservations', error: error.message });
  }
};

module.exports = { listAllReservations };
