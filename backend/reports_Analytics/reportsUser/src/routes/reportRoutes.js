const express = require('express');
const router = express.Router();
const { getReservationsByUser, getReservationsByUsername } = require('../controller/reportController');

/**
 * @swagger
 * /api/reports/user/{userId}:
 *   get:
 *     summary: Get all reservations by user ID
 *     tags:
 *       - Reports
 *     description: Returns all reservations made by a specific user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's unique ID
 *     responses:
 *       200:
 *         description: List of reservations for the user
 *         content:
 *           application/json:
 *             example:
 *               userId: "12345"
 *               totalReservations: 2
 *               reservations:
 *                 - reservationId: "abc1"
 *                   date: "2024-07-01"
 *                   space: "Room 101"
 *                 - reservationId: "abc2"
 *                   date: "2024-07-02"
 *                   space: "Room 102"
 *       404:
 *         description: User or reservations not found
 *         content:
 *           application/json:
 *             example:
 *               error: "No reservations found for this user"
 */

/**
 * @swagger
 * /api/reports/username/{username}:
 *   get:
 *     summary: Get all reservations by username
 *     tags:
 *       - Reports
 *     description: Looks up the user ID by username (via external microservice), then returns reservations.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's username
 *     responses:
 *       200:
 *         description: List of reservations for the user by username
 *         content:
 *           application/json:
 *             example:
 *               username: "johndoe"
 *               email: "johndoe@email.com"
 *               userId: "12345"
 *               totalReservations: 2
 *               reservations:
 *                 - reservationId: "abc1"
 *                   date: "2024-07-01"
 *                   space: "Room 101"
 *                 - reservationId: "abc2"
 *                   date: "2024-07-02"
 *                   space: "Room 102"
 *       404:
 *         description: User or reservations not found
 *         content:
 *           application/json:
 *             example:
 *               error: "User not found"
 */

router.get('/user/:userId', getReservationsByUser);
router.get('/username/:username', getReservationsByUsername); 

module.exports = router;
