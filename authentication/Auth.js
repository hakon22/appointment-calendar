const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../db/tables/Users.js');

const generateAccessToken = (id, email) => jwt.sign({ id, email }, 'putin', {expiresIn: "1h"});

class Auth {

  async signup(req, res) {
    try {
      const { username, phone, password, email } = req.body;
      const candidate = await Users.findOne({ where: { email } });
      if (candidate) {
        return res.json({ message: 'Такой email уже существует', code: 1 });
      }
      const hashPassword = bcrypt.hashSync(password, 10);
      await Users.create({ username, phone, password: hashPassword, email });
      res.json({ code: 5 });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return res.json({ message: 'Такой пользователь не зарегистрирован', code: 1 });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.json({ message: 'Неверный пароль', code: 2 });
      }
      const token = generateAccessToken(user.id, user.email);
      const username = user.username;
      res.status(200).send({ token, username });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

module.exports = new Auth();