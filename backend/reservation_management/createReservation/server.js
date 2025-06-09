const express = require('express');
const sequelize = require('./src/config/db');
const reservaRoutes = require('./src/routes/reservationRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api', reservaRoutes);

const PORT = process.env.PORT || 3001;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor de reservas corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos:', err);
  });
