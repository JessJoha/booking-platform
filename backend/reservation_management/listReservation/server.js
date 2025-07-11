const express = require('express');
require('dotenv').config();
const sequelize = require('./src/config/db');
const cors = require('cors');
const listRoutes = require('./src/routes/listRoutes');

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'List Reservations API',
      version: '1.0.0',
      description: 'API documentation for List Reservations Microservice',
    },
  },
  apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);


const app = express();
app.use(cors());
app.use(express.json());

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', listRoutes);

app.get('/listReservations', (req, res) => {
  res.status(200).send('list Reservation Service is running');
});

if (require.main === module) {
  const PORT = process.env.PORT || 3004;
  sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`List Reservations Microservice running on port ${PORT}`);
      console.log(`Swagger docs available at http://44.198.112.22:${PORT}/api-docs`);
    });
  }).catch(err => {
    console.error('Database connection error:', err);
  });
}


module.exports = app;
