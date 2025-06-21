const express = require('express');
const router = express.Router();
const { listAllReservations } = require('../controller/listController');
const verifyToken = require('../middleware/auth');

router.get('/reservations:list', verifyToken, listAllReservations);

module.exports = router;
