const { Booking } = require('../model/updateModel');

const updateReservation = async (req, res) => {
  const id = req.params.id;
  const { date, time, reason, spaceId } = req.body;  // ✅ usar spaceId

  try {
    const reservation = await Booking.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    
    reservation.date = date || reservation.date;
    reservation.time = time || reservation.time;
    reservation.reason = reason || reservation.reason;
    reservation.spaceId = spaceId || reservation.spaceId;

    await reservation.save();

    res.status(200).json({ message: 'Reservation updated successfully', reservation });
  } catch (error) {
    console.error('Error updating reservation:', error.message);
    res.status(500).json({ message: 'Error updating reservation', error: error.message });
  }
};

module.exports = { updateReservation };
