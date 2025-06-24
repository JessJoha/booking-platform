const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'reservation-service',
  brokers: [process.env.KAFKA_BROKER],  
  sasl: {
    mechanism: 'scram-sha-256',
    username: process.env.KAFKA_USERNAME, 
    password: process.env.KAFKA_PASSWORD   
  },
  ssl: true  
});

const producer = kafka.producer();

/**
 * Send a reservation event to the configured Kafka topic.
 * @param {Object} event 
 */
async function sendReservationEvent(event) {
  try {
    await producer.connect();

    await producer.send({
      topic: process.env.KAFKA_TOPIC || 'reservation-events',
      messages: [
        { value: JSON.stringify(event) }
      ]
    });

    await producer.disconnect();
    console.log(`Event sent to Kafka: ${JSON.stringify(event)}`);
  } catch (error) {
    console.error('Error sending event to Kafka:', error);
  }
}

module.exports = { sendReservationEvent };

