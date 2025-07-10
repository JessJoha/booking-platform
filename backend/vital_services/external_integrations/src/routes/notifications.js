const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const { validateNotification } = require('../utils/validation');
const logger = require('../utils/logger');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification service endpoints for sending SMS, email, push notifications, and messaging integrations
 */

/**
 * @swagger
 * /api/v1/notifications/sms:
 *   post:
 *     summary: Send SMS notification
 *     description: Sends an SMS notification to a specified phone number
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - message
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number to send SMS to (E.164 format)
 *                 example: "+1234567890"
 *               message:
 *                 type: string
 *                 description: SMS message content
 *                 example: "Your booking has been confirmed!"
 *               metadata:
 *                 type: object
 *                 description: Additional metadata
 *                 example: { "bookingId": "book_123" }
 *     responses:
 *       200:
 *         description: SMS sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "SMS sent successfully"
 *                 messageId:
 *                   type: string
 *                   example: "msg_123456"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to send SMS
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
/**
 * @swagger
 * /api/v1/notifications/email:
 *   post:
 *     summary: Send email notification
 *     description: Sends an email notification to specified recipients
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - content
 *             properties:
 *               to:
 *                 oneOf:
 *                   - type: string
 *                     format: email
 *                   - type: array
 *                     items:
 *                       type: string
 *                       format: email
 *                 description: Recipient email address(es)
 *                 example: "user@example.com"
 *               subject:
 *                 type: string
 *                 description: Email subject line
 *                 example: "Booking Confirmation"
 *               content:
 *                 type: string
 *                 description: Email content
 *                 example: "Your booking has been confirmed."
 *               isHtml:
 *                 type: boolean
 *                 default: false
 *                 description: Whether content is HTML formatted
 *               cc:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *                 description: CC recipients
 *               bcc:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *                 description: BCC recipients
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email sent successfully"
 *                 messageId:
 *                   type: string
 *                   example: "email_123456"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to send email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/email', async (req, res) => {
  try {
    const { to, subject, content, isHtml = false } = req.body;
    
    if (!to || !subject || !content) {
      return res.status(400).json({
        success: false,
        error: 'To, subject, and content are required'
      });
    }

    const result = await notificationService.sendEmail(to, subject, content, isHtml);
    
    res.json({
      success: result.success,
      message: result.success ? 'Email sent successfully' : result.message,
      messageId: result.messageId
    });
  } catch (error) {
    logger.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email notification'
    });
  }
});

/**
 * @route POST /api/v1/notifications/booking/confirmation
 * @desc Send booking confirmation notification
 * @access Private
 */
router.post('/booking/confirmation', validateNotification, async (req, res) => {
  try {
    const { booking, userContact } = req.body;
    
    const result = await notificationService.sendBookingConfirmation(booking, userContact);
    
    res.json({
      success: true,
      message: 'Booking confirmation notifications sent',
      results: result
    });
  } catch (error) {
    logger.error('Error sending booking confirmation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send booking confirmation'
    });
  }
});


module.exports = router;
