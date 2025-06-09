require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: process.env.AWS_REGION,
  
});

const sqs = new AWS.SQS();

const params = {
  MessageBody: JSON.stringify({ test: 'Este es un mensaje de prueba desde el microservicio.' }),
  QueueUrl: process.env.SQS_REASIGNACION_URL,
};

sqs.sendMessage(params, (err, data) => {
  if (err) {
    console.error('❌ Error al enviar el mensaje:', err);
  } else {
    console.log('✅ Mensaje enviado con éxito. ID:', data.MessageId);
  }
});
