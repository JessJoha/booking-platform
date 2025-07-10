const express = require('express');
require('dotenv').config();
const sequelize = require('./config/db');
const reservationRoutes = require('./src/routes/deleteRoutes');

const app = express();
app.use(express.json());

app.use('/api', reservationRoutes);

sequelize.sync().then(() => {
  console.log('Database synced');
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Delete Reservation Microservice running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
});
