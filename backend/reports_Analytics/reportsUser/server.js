const express = require('express');
const reportRoutes = require('./src/routes/reportRoutes');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Reports API',
      version: '1.0.0',
      description: 'API documentation for the User Reports microservice',
    },
  },
  apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/reports', reportRoutes);
app.get('/reportUser', (req, res) => {
  res.status(200).send('OK');
});

if (require.main === module) {
  const PORT = process.env.PORT || 3009;
  app.listen(PORT, () => {
    console.log(`reportsUser microservice running on port ${PORT}`);
    console.log(`test`);
    console.log(`Swagger API docs available at: http://13.223.29.133:${PORT}/api-docs`);
  });
}


module.exports = app;
