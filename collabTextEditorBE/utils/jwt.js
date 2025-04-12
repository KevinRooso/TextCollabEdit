const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function generateToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

module.exports = { generateToken, verifyToken };
