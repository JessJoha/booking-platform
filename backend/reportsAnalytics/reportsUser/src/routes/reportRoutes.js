const express = require('express');
const router = express.Router();
const { getReservationsByUser, getReservationsByUsername } = require('../controller/reportController');

router.get('/user/:userId', getReservationsByUser);
router.get('/username/:username', getReservationsByUsername); 

module.exports = router;
