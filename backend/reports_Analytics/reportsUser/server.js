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
  apis: ['./src/routes/*.js'], // Scan for JSDoc comments in route files
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log(`reportsUser microservice running on port ${PORT}`);
console.log(`Swagger API docs available at: http://localhost:${PORT}/api-docs`);
});
