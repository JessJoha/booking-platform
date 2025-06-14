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
MessageBody: JSON.stringify({ test: 'This is a test message from the microservice.' }), 
QueueUrl: process.env.SQS_REASIGNACION_URL,
};

sqs.sendMessage(params, (err, data) => {
if (err) {
console.error('❌ Error sending message:', err);
} else {
console.log('✅ Message sent successfully. ID:', data.MessageId);
}
});