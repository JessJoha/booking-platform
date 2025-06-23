const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER],
  sasl: {
    mechanism: 'scram-sha-256',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
  ssl: true,
});

const producer = kafka.producer();


async function sendReservationEvent(event) {
  try {
    await producer.send({
      topic: 'reservation-events',
      messages: [
        { value: JSON.stringify(event) },
      ],
    });
    console.log('Message sent to Kafka');
  } catch (error) {
    console.error('Error sending message to Kafka:', error);
  }
}


async function run() {
  await producer.connect();
  console.log('Kafka producer connected successfully');
}

run().catch(console.error);


module.exports = { sendReservationEvent };
