const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, email) => jwt.sign({ id, email }, 'putin', {expiresIn: "1h"});