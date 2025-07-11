const express = require('express');
const router = express.Router();
const { listAllReservations } = require('../controller/listController');
const verifyToken = require('../middleware/auth');

/**
 * @swagger
 * /reservations:list:
 *   get:
 *     summary: Get all reservations
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     description: Returns a list of all reservations. Requires JWT authentication.
 *     responses:
 *       200:
 *         description: A list of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   spaceId:
 *                     type: string
 *                   date:
 *                     type: string
 *                   time:
 *                     type: string
 *                   reason:
 *                     type: string
 *       401:
 *         description: Unauthorized - JWT is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/reservations:list', verifyToken, listAllReservations);

module.exports = router;
