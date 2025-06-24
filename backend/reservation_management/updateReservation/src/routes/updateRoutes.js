const express = require('express');
const router = express.Router();
const { updateReservation } = require('../controller/updateController');
const verifyToken = require('../middleware/auth');

router.put('/reservations/:id', verifyToken, updateReservation);

module.exports = router;
