const express = require('express');
const app = express();
require('dotenv').config();
const sequelize = require('./src/config/db');
const updateRoutes = require('./src/routes/updateRoutes');

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Update Reservation API',
      version: '1.0.0',
      description: 'API documentation for Update Reservation Microservice',
    },
  },
  apis: ['./src/routes/*.js'], 
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', updateRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Delete Reservation Service is running');
});

if (require.main === module) {
  const PORT = process.env.PORT || 3003;
  sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Update Reservation Microservice running on port ${PORT}`);
      console.log(`Swagger docs available at http://44.198.112.22:${PORT}/api-docs`);
    });
  }).catch(err => {
    console.error('Database connection error:', err);
  });
}


module.exports = app;
