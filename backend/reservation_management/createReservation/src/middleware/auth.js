const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  let token = req.headers['authorization'];

  if (!token) return res.status(403).json({ message: 'Token required' });

  
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error en jwt.verify:", err);
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
