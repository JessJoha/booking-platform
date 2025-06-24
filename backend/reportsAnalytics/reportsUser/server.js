const express = require('express');
const reportRoutes = require('./src/routes/reportRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log(`reportsUser microservice running on port ${PORT}`);
});
  