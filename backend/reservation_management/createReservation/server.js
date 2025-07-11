const express = require('express');
require('dotenv').config();
const sequelize = require('./src/config/db');
const cors = require('cors');
const reservationRoutes = require('./src/routes/reservationRoutes'); 

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
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', reservationRoutes);

const PORT = process.env.PORT || 3001;


app.get('/reservations', (req, res) => {
  res.status(200).send('Reservation Service is running');
});


if (require.main === module) {
  sequelize.authenticate()
    .then(() => {
      console.log('Connection to database established successfully.');
      return sequelize.sync();
    })
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Reservation server running on port ${PORT}`);
        console.log(`Swagger docs available at http://44.198.112.22:${PORT}/api-docs`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to the database:', err);
      console.log('test');
    });
}

module.exports = app;
