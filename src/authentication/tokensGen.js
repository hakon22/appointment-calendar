const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (id, email) => jwt.sign({ id, email }, process.env.KEY_TOKEN, { expiresIn: '10m' });
const generateRefreshToken = (id, email) => jwt.sign({ id, email }, process.env.KEY_REFRESH_TOKEN, { expiresIn: '30d' });

module.exports = { generateAccessToken, generateRefreshToken };
