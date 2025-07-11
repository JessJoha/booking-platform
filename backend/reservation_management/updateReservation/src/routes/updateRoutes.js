const express = require('express');
const router = express.Router();
const { updateReservation } = require('../controller/updateController');
const verifyToken = require('../middleware/auth');

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update an existing reservation by ID
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
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID
 *               spaceId:
 *                 type: string
 *                 description: Space ID
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Reservation date
 *               time:
 *                 type: string
 *                 description: Reservation time
 *               reason:
 *                 type: string
 *                 description: Reason for reservation
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation:
 *                   type: object
 *                   description: The updated reservation object
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - JWT is missing or invalid
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */
router.put('/reservations/:id', verifyToken, updateReservation);

module.exports = router;
