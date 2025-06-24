const { Booking } = require('../model/deleteModel');
const { sendReservationEvent } = require('../kafkaProducer');
require('dotenv').config();
const axios = require('axios');
const AWS = require('aws-sdk');
const moment = require('moment');

const deleteReservation = async (req, res) => {
  const id = req.params.id;

  try {
    const reservation = await Booking.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    await reservation.destroy();

    const event = {
      spaceId: reservation.spaceId,  
      date: reservation.date,        
      action: 'deleted'              
    };

     sendReservationEvent(event);

   

    res.status(200).json({ message: 'Reservation successfully cancelled.' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Error deleting reservation', error: error.message });
  }
};

const getReservationById = async (req, res) => {
  const id = req.params.id;

  try {
    const reservation = await Booking.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reservation', error });
  }
};

module.exports = { deleteReservation, getReservationById };
