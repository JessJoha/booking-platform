const express = require('express');
const sequelize = require('./src/config/db');
const reservationRoutes = require('./src/routes/reservationRoutes'); 
require('dotenv').config();

const app = express();
app.use(express.json());


app.use('/api', reservationRoutes);

const PORT = process.env.PORT || 3001;


sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Reservation server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });
