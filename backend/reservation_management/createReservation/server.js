const express = require('express');
const sequelize = require('./src/config/db');
const reservationRoutes = require('./src/routes/reservaRoutes'); // you can rename to 'reservationRoutes.js' for consistency
require('dotenv').config();

const app = express();
app.use(express.json());

// Register routes under /api path
app.use('/api', reservationRoutes);

const PORT = process.env.PORT || 3001;

// Connect to the database and start the server
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Reservation server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });
