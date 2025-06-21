const express = require('express');
const app = express();
require('dotenv').config();
const sequelize = require('./src/config/db');
const updateRoutes = require('./src/routes/updateRoutes');

app.use(express.json());
app.use('/api', updateRoutes);

const PORT = process.env.PORT || 3003;

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Update Reservation Microservice running on port ${PORT}`);
  });
});
