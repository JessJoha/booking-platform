const express = require('express');
const router = express.Router();
const { deleteReservation, getReservationById } = require('../controller/deleteController');
const verifyToken = require('../middleware/auth');

router.delete('/reservations/:id', verifyToken, deleteReservation);
router.get('/reservations/:id', verifyToken, getReservationById);

module.exports = router;
