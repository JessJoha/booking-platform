const express = require('express');
const app = express();
require('dotenv').config();
const sequelize = require('./src/config/db');
const listRoutes = require('./src/routes/listRoutes');

app.use(express.json());
app.use('/api', listRoutes);

const PORT = process.env.PORT || 3004;

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`List Reservations Microservice running on port ${PORT}`);
  });
});
