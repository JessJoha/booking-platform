const express = require('express');
const sequelize = require('./src/config/db');
const reservationRoutes = require('./src/routes/reservationRoutes'); 
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reservation API',
      version: '1.0.0',
      description: 'API documentation for Reservation Management',
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', reservationRoutes);

const PORT = process.env.PORT || 3001;


if (require.main === module) {
  sequelize.sync()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Reservation server running on port ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to the database:', err);
    });
}


module.exports = app;
