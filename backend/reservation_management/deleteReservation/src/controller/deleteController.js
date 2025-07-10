const { Reservation } = require('../models/deleteModel');
const axios = require('axios');
const AWS = require('aws-sdk');
const moment = require('moment');
require('dotenv').config();

// Configure AWS SQS
const sqs = new AWS.SQS({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

// URLs
const QUEUE_URL = process.env.SQS_REASSIGNMENT_URL;
const RULES_URL = process.env.CANCELLATION_RULES_URL || 'http://localhost:4001/rules';

const deleteReservation = async (req, res) => {
  const id = req.params.id;

  try {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // 1. Get cancellation rules from the microservice
    const response = await axios.get(RULES_URL);
    const requiredHours = response.data.horasAnticipacion;

    // 2. Validate if cancellation is allowed
    const reservationDateTime = moment(`${reservation.date} ${reservation.time}`, 'YYYY-MM-DD HH:mm');
    const now = moment();
    const diffHours = reservationDateTime.diff(now, 'hours');

    if (diffHours < requiredHours) {
      return res.status(400).json({ message: `Cancellations must be made at least ${requiredHours} hours in advance.` });
    }

   
    await reservation.destroy();

    // 4. Send message to reassignment microservice via SQS
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

    res.status(200).json({ message: 'Reservation successfully cancelled and event sent to reassignment service.' });

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
