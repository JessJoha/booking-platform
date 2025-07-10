const axios = require('axios');
const config = require('../config/integrations');
const logger = require('../utils/logger');

class NotificationService {
  constructor() {
    this.twilio = require('twilio')(
      config.twilio.accountSid,
      config.twilio.authToken
    );
    this.sendGridApiKey = config.sendGrid.apiKey;
  }

  /**
   * Send SMS notification
   */
  async sendSMS(phoneNumber, message) {
    try {
      if (!config.twilio.accountSid || !config.twilio.authToken) {
        logger.warn('Twilio credentials not configured, skipping SMS');
        return { success: false, message: 'SMS service not configured' };
      }

      const result = await this.twilio.messages.create({
        body: message,
        from: config.twilio.phoneNumber,
        to: phoneNumber
      });

      logger.info('SMS sent successfully:', result.sid);
      return {
        success: true,
        messageId: result.sid,
        status: result.status
      };
    } catch (error) {
      logger.error('Error sending SMS:', error);
      throw new Error('Failed to send SMS notification');
    }
  }

  /**
   * Send email notification
   */
  async sendEmail(to, subject, content, isHtml = false) {
    try {
      if (!this.sendGridApiKey) {
        logger.warn('SendGrid API key not configured, skipping email');
        return { success: false, message: 'Email service not configured' };
      }

      const emailData = {
        personalizations: [{
          to: [{ email: to }],
          subject: subject
        }],
        from: { email: config.sendGrid.fromEmail },
        content: [{
          type: isHtml ? 'text/html' : 'text/plain',
          value: content
        }]
      };

      const response = await axios.post(
        'https://api.sendgrid.com/v3/mail/send',
        emailData,
        {
          headers: {
            'Authorization': `Bearer ${this.sendGridApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info('Email sent successfully to:', to);
      return {
        success: true,
        messageId: response.headers['x-message-id']
      };
    } catch (error) {
      logger.error('Error sending email:', error);
      throw new Error('Failed to send email notification');
    }
  }

  /**
   * Send booking confirmation notification
   */
  async sendBookingConfirmation(booking, userContact) {
    try {
      const message = `Booking confirmed! ${booking.spaceName} on ${booking.date} at ${booking.time}. Confirmation: ${booking.confirmationNumber}`;
      
      const emailContent = `
        <h2>Booking Confirmation</h2>
        <p>Dear ${booking.userName},</p>
        <p>Your booking has been confirmed with the following details:</p>
        <ul>
          <li><strong>Space:</strong> ${booking.spaceName}</li>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time:</strong> ${booking.time}</li>
          <li><strong>Duration:</strong> ${booking.duration}</li>
          <li><strong>Location:</strong> ${booking.location}</li>
          <li><strong>Confirmation Number:</strong> ${booking.confirmationNumber}</li>
        </ul>
        <p>Thank you for choosing our platform!</p>
      `;

      const results = await Promise.allSettled([
        userContact.email ? this.sendEmail(
          userContact.email,
          'Booking Confirmation',
          emailContent,
          true
        ) : Promise.resolve({ success: false, message: 'No email provided' }),
        userContact.phone ? this.sendSMS(
          userContact.phone,
          message
        ) : Promise.resolve({ success: false, message: 'No phone provided' })
      ]);

      return {
        email: results[0].status === 'fulfilled' ? results[0].value : { success: false, error: results[0].reason },
        sms: results[1].status === 'fulfilled' ? results[1].value : { success: false, error: results[1].reason }
      };
    } catch (error) {
      logger.error('Error sending booking confirmation:', error);
      throw new Error('Failed to send booking confirmation');
    }
  }

  /**
   * Send booking reminder notification
   */
  async sendBookingReminder(booking, userContact, hoursUntil) {
    try {
      const message = `Reminder: Your booking for ${booking.spaceName} is in ${hoursUntil} hours (${booking.date} at ${booking.time}). Confirmation: ${booking.confirmationNumber}`;
      
      const emailContent = `
        <h2>Booking Reminder</h2>
        <p>Dear ${booking.userName},</p>
        <p>This is a friendly reminder that your booking is coming up:</p>
        <ul>
          <li><strong>Space:</strong> ${booking.spaceName}</li>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time:</strong> ${booking.time}</li>
          <li><strong>Location:</strong> ${booking.location}</li>
          <li><strong>Time until booking:</strong> ${hoursUntil} hours</li>
        </ul>
        <p>We look forward to seeing you!</p>
      `;

      const results = await Promise.allSettled([
        userContact.email ? this.sendEmail(
          userContact.email,
          'Booking Reminder',
          emailContent,
          true
        ) : Promise.resolve({ success: false, message: 'No email provided' }),
        userContact.phone ? this.sendSMS(
          userContact.phone,
          message
        ) : Promise.resolve({ success: false, message: 'No phone provided' })
      ]);

      return {
        email: results[0].status === 'fulfilled' ? results[0].value : { success: false, error: results[0].reason },
        sms: results[1].status === 'fulfilled' ? results[1].value : { success: false, error: results[1].reason }
      };
    } catch (error) {
      logger.error('Error sending booking reminder:', error);
      throw new Error('Failed to send booking reminder');
    }
  }

  /**
   * Send booking cancellation notification
   */
  async sendBookingCancellation(booking, userContact, reason) {
    try {
      const message = `Booking cancelled: ${booking.spaceName} on ${booking.date} at ${booking.time}. Reason: ${reason}. Confirmation: ${booking.confirmationNumber}`;
      
      const emailContent = `
        <h2>Booking Cancellation</h2>
        <p>Dear ${booking.userName},</p>
        <p>We regret to inform you that your booking has been cancelled:</p>
        <ul>
          <li><strong>Space:</strong> ${booking.spaceName}</li>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time:</strong> ${booking.time}</li>
          <li><strong>Confirmation Number:</strong> ${booking.confirmationNumber}</li>
          <li><strong>Reason:</strong> ${reason}</li>
        </ul>
        <p>If you have any questions, please contact our support team.</p>
      `;

      const results = await Promise.allSettled([
        userContact.email ? this.sendEmail(
          userContact.email,
          'Booking Cancellation',
          emailContent,
          true
        ) : Promise.resolve({ success: false, message: 'No email provided' }),
        userContact.phone ? this.sendSMS(
          userContact.phone,
          message
        ) : Promise.resolve({ success: false, message: 'No phone provided' })
      ]);

      return {
        email: results[0].status === 'fulfilled' ? results[0].value : { success: false, error: results[0].reason },
        sms: results[1].status === 'fulfilled' ? results[1].value : { success: false, error: results[1].reason }
      };
    } catch (error) {
      logger.error('Error sending booking cancellation:', error);
      throw new Error('Failed to send booking cancellation');
    }
  }

  /**
   * Send weather alert notification
   */
  async sendWeatherAlert(alert, userContact) {
    try {
      const message = `Weather Alert: ${alert.event} - ${alert.description}`;
      
      const emailContent = `
        <h2>Weather Alert</h2>
        <p>Dear User,</p>
        <p>We wanted to inform you about a weather alert that may affect your booking:</p>
        <ul>
          <li><strong>Event:</strong> ${alert.event}</li>
          <li><strong>Severity:</strong> ${alert.severity}</li>
          <li><strong>Description:</strong> ${alert.description}</li>
          <li><strong>Start:</strong> ${alert.start}</li>
          <li><strong>End:</strong> ${alert.end}</li>
        </ul>
        <p>Please take necessary precautions and consider rescheduling if needed.</p>
      `;

      const results = await Promise.allSettled([
        userContact.email ? this.sendEmail(
          userContact.email,
          'Weather Alert',
          emailContent,
          true
        ) : Promise.resolve({ success: false, message: 'No email provided' }),
        userContact.phone ? this.sendSMS(
          userContact.phone,
          message
        ) : Promise.resolve({ success: false, message: 'No phone provided' })
      ]);

      return {
        email: results[0].status === 'fulfilled' ? results[0].value : { success: false, error: results[0].reason },
        sms: results[1].status === 'fulfilled' ? results[1].value : { success: false, error: results[1].reason }
      };
    } catch (error) {
      logger.error('Error sending weather alert:', error);
      throw new Error('Failed to send weather alert');
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(notifications) {
    try {
      const results = [];
      
      for (const notification of notifications) {
        try {
          let result;
          
          switch (notification.type) {
            case 'email':
              result = await this.sendEmail(
                notification.to,
                notification.subject,
                notification.content,
                notification.isHtml
              );
              break;
            case 'sms':
              result = await this.sendSMS(
                notification.to,
                notification.message
              );
              break;
            default:
              result = { success: false, message: 'Unknown notification type' };
          }
          
          results.push({
            id: notification.id,
            success: result.success,
            messageId: result.messageId
          });
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          results.push({
            id: notification.id,
            success: false,
            error: error.message
          });
        }
      }

      logger.info(`Bulk notification completed: ${results.filter(r => r.success).length}/${results.length} successful`);
      return results;
    } catch (error) {
      logger.error('Error sending bulk notifications:', error);
      throw new Error('Failed to send bulk notifications');
    }
  }
}

module.exports = new NotificationService();
