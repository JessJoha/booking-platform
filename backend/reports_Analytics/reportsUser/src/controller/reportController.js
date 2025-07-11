const Booking = require('../model/reportModel');
const axios = require('axios');


const getReservationsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const reservations = await Booking.findAll({
      where: { userId },
      order: [['date', 'DESC'], ['time', 'DESC']]
    });

    res.status(200).json({
      userId,
      totalReservations: reservations.length,
      reservations
    });
  } catch (err) {
    console.error('Error fetching reservations by userId:', err.message);
    res.status(500).json({ message: 'Error retrieving reservations' });
  }
};


const getReservationsByUsername = async (req, res) => {
  let { username } = req.params;
  username = username.trim(); 

  console.log("🔎 Searching for reservations for:", username);

try {
  const response = await axios.get(`http://34.234.124.88:5007/user/${encodeURIComponent(username)}`);
  const user = response.data; 

  console.log("📡 Response from the profile microservice:", user);

  if (!user || !user.id) {
  console.log("User not found or no ID");
  return res.status(404).json({ message: 'User not found' });
  }

const userId = user.id;
console.log("Searching for reservations with userId:", userId);

    const reservations = await Booking.findAll({
      where: { userId },
      order: [['date', 'DESC'], ['time', 'DESC']]
    });

    res.status(200).json({
      username: user.username,
      email: user.email,
      userId,
      totalReservations: reservations.length,
      reservations
    });

  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ message: 'Error retrieving reservations' });
  }
};

module.exports = {
  getReservationsByUser,
  getReservationsByUsername
};
