const express = require('express');
const router = express.Router();
const { create } = require('../controller/reservationModel'); 
const verifyToken = require('../middleware/auth');

router.post('/reservations', verifyToken, create); 

module.exports = router;
