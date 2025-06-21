const { Booking } = require('../model/deleteModel');
require('dotenv').config();
const axios = require('axios');
const AWS = require('aws-sdk');
const moment = require('moment');

// const axios = require('axios');
// const AWS = require('aws-sdk');
// const moment = require('moment');

// Configuración futura de AWS SQS (desactivado por ahora)
/*
const sqs = new AWS.SQS({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});
const QUEUE_URL = process.env.SQS_REASSIGNMENT_URL;
*/

// URL futura del microservicio de reglas (desactivado)
/* const RULES_URL = process.env.CANCELLATION_RULES_URL || 'http://localhost:4001/rules'; */

const deleteReservation = async (req, res) => {
  const id = req.params.id;

  try {
    const reservation = await Booking.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Validación futura contra reglas de cancelación
    /*
    const response = await axios.get(RULES_URL);
    const requiredHours = response.data.horasAnticipacion;

    const reservationDateTime = moment(`${reservation.date} ${reservation.time}`, 'YYYY-MM-DD HH:mm');
    const now = moment();
    const diffHours = reservationDateTime.diff(now, 'hours');

    if (diffHours < requiredHours) {
      return res.status(400).json({
        message: `Cancellations must be made at least ${requiredHours} hours in advance.`
      });
    }
    */

    // Eliminar la reserva
    await reservation.destroy();

    // Envío futuro al microservicio de reasignación
    /*
    const message = {
      id: reservation.id,
      userId: reservation.userId,
      space: reservation.space,
      date: reservation.date,
      time: reservation.time,
      reason: reservation.reason,
      action: 'cancellation'
    };

    await sqs.sendMessage({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(message)
    }).promise();
    */

    res.status(200).json({ message: 'Reservation successfully cancelled.' });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Error deleting reservation', error: error.message });
  }
};

const getReservationById = async (req, res) => {
  const id = req.params.id;

  try {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reservation', error });
  }
};


module.exports = { deleteReservation, getReservationById };
