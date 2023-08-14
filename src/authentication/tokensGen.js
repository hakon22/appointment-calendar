const jwt = require('jsonwebtoken');

const generateAccessToken = (id, email) => jwt.sign({ id, email }, 'putin', { expiresIn: '10m' });
const generateRefreshToken = (id, email) => jwt.sign({ id, email }, 'refreshPutin', { expiresIn: '30d' });

module.exports = { generateAccessToken, generateRefreshToken };
