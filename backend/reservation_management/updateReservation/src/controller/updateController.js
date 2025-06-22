const { Booking } = require('../model/updateModel');
const { sendReservationEvent } = require('../kafkaProducer'); // Asegurarse de incluir el producer

const updateReservation = async (req, res) => {
  const id = req.params.id;
  const { date, time, reason, spaceId } = req.body;

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

    
    const event = {
      spaceId: reservation.spaceId,  
      date: reservation.date,        
      action: 'updated'              
    };

    
    sendReservationEvent(event);

    res.status(200).json({ message: 'Reservation updated successfully', reservation });
  } catch (error) {
    console.error('Error updating reservation:', error.message);
    res.status(500).json({ message: 'Error updating reservation', error: error.message });
  }
};

module.exports = { updateReservation };
