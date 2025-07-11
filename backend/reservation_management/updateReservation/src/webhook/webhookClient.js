const axios = require('axios');

const sendOccupancyEvent = async (spaceId, date, action) => {
  try {
    const payload = {
      spaceId,
      date,
      action
    };

    const response = await axios.post('http://13.223.29.133:6000/webhook/occupancy', payload);
    console.log(`Webhook sent to occupancyReports: ${action}`, response.status);
  } catch (error) {
    console.error('Error sending event to busy webhook:', error.message);
  }
};

module.exports = { sendOccupancyEvent };
