const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../db/tables/Users.js');

const generateAccessToken = (id, email) => jwt.sign({ id, email }, 'putin', { expiresIn: 10 });
const generateRefreshToken = (id, email) => jwt.sign({ id, email }, 'refreshPutin', { expiresIn: "30d" });

const adminEmail = ['hakon1@mail.ru'];

class Authentication {

  async signup(req, res) {
    try {
      const { username, phone, password, email } = req.body;
      const candidate = await Users.findOne({ where: { email } });
      if (candidate) {
        return res.json({ message: 'Такой email уже существует', code: 1 });
      }
      const role = adminEmail.includes(email) ? 'admin' : 'member'; 
      const hashPassword = bcrypt.hashSync(password, 10);
      await Users.create({ username, phone, password: hashPassword, email, role });
      res.json({ code: 5 });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async login(req, res) {
    try {
      const { email, password, save } = req.body;
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return res.json({ message: 'Такой пользователь не зарегистрирован', code: 1 });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.json({ message: 'Неверный пароль', code: 2 });
      }
      const token = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);
      const {
        username,
        id,
        role,
      } = user;
      if (save) {
        if (!user.refresh_token) {
          await Users.update({ refresh_token: [refreshToken] }, { where: { email } });
        } else {
          user.refresh_token.push(refreshToken);
          await Users.update({ refresh_token: user.refresh_token }, { where: { email } });
        }
      }
      res.status(200).send({ token, refreshToken, username, id, role });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

const Auth = new Authentication();

module.exports = { Auth, generateAccessToken, generateRefreshToken };