const express = require('express');

const router = express.Router();

const { create } = require('../controller/reservationController');
const verifyToken = require('../middleware/auth');

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - spaceId
 *               - date
 *               - time
 *               - reason
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user
 *               spaceId:
 *                 type: string
 *                 description: ID of the space
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Reservation date
 *               time:
 *                 type: string
 *                 description: Reservation time
 *               reason:
 *                 type: string
 *                 description: Reason for the reservation
 *     responses:
 *       201:
 *         description: Reservation successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation:
 *                   type: object
 *                   description: The created reservation object
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/reservations', verifyToken, create); 

module.exports = router;
