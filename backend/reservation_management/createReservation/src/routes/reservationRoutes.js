const express = require('express');
const router = express.Router();
const { crear } = require('../controller/reservationController');
const verifyToken = require('../middleware/auth');

router.post('/reservas', verifyToken, crear);

module.exports = router;
