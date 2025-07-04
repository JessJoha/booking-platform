const express = require('express');
require('dotenv').config();
const sequelize = require('./src/config/db');
const reservationRoutes = require('./src/routes/deleteRoutes');

// Swagger setup
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
  apis: ['./src/routes/*.js'], // Ajusta la ruta si tus rutas están en otro lugar
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();
app.use(express.json());

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', reservationRoutes);
sequelize.sync().then(() => {
  console.log('Database synced');
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Delete Reservation Microservice running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
});
