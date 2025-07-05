const express = require('express');
require('dotenv').config();
const sequelize = require('./src/config/db');
const reservationRoutes = require('./src/routes/deleteRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Delete Reservation API',
      version: '1.0.0',
      description: 'API documentation for Delete Reservation Microservice',
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', reservationRoutes);

if (require.main === module) {
  sequelize.sync()
    .then(() => {
      console.log('Database synced');
      const PORT = process.env.PORT || 3002;
      app.listen(PORT, () => {
        console.log(`Delete Reservation Microservice running on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
      });
    })
    .catch(err => {
      console.error('Database connection error:', err);
    });
}

module.exports = app;
