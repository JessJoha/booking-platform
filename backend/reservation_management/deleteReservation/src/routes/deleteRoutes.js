const express = require('express');
const router = express.Router();
const { deleteReservation, getReservationById } = require('../controller/deleteController');
const verifyToken = require('../middleware/auth');

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Deletes a reservation by ID
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reservation to delete
 *     responses:
 *       200:
 *         description: Reservation successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reservation not found
 *   get:
 *     summary: Retrieves a reservation by ID
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reservation to retrieve
 *     responses:
 *       200:
 *         description: Reservation found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation:
 *                   type: object
 *                   description: Reservation object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Reservation not found
 */
router.delete('/reservations/:id', verifyToken, deleteReservation);

module.exports = router;
