const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },

  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Connection to database established successfully.');
  })
  .catch((err) => {
    console.error('Could not connect to the database. Verify credentials and connectivity:', err);
  });

module.exports = sequelize;
