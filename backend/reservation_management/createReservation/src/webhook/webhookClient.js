const axios = require('axios');

async function sendWebhookEvent(event) {
  try {
    const response = await axios.post('http://13.223.29.133:6000/webhook/occupancy', event);
    console.log('Webhook sent successfully:', response.status);
  } catch (error) {
    console.error('Failed to send webhook:', error.message);
  }
}

module.exports = { sendWebhookEvent };
