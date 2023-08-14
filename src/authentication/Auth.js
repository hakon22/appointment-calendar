const bcrypt = require('bcryptjs');
const { codeGen } = require('../activation/Activation.js');
const Users = require('../db/tables/Users.js');
const sendMail = require('../mail/sendMail.js');
const { generateAccessToken, generateRefreshToken } = require('../authentication/tokensGen.js');

const adminEmail = ['hakon1@mail.ru'];

class Authentication {

  async signup(req, res) {
    try {
      const { username, phone, password, email } = req.body;
      const candidate = await Users.findOne({ where: { email } });
      if (candidate) {
        return res.json({ message: 'Такой email уже существует', code: 2 });
      }
      const role = adminEmail.includes(email) ? 'admin' : 'member'; 
      const hashPassword = bcrypt.hashSync(password, 10);
      const code_activation = codeGen();
      const user = await Users.create({ username, phone, password: hashPassword, email, role, code_activation });
      const { id } = user;
      await sendMail(id, username, email, code_activation);
      res.json({ code: 1, id });
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
      if (user.code_activation) {
        return res.json({ message: 'Аккаунт не активирован', code: 3 });
      }
      const token = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);
      const {
        username,
        id,
        role,
      } = user;
      if (!user.refresh_token) {
        await Users.update({ refresh_token: [refreshToken] }, { where: { email } });
      } else if (user.refresh_token.length < 3) {
        user.refresh_token.push(refreshToken);
        await Users.update({ refresh_token: user.refresh_token }, { where: { email } });
      } else {
        await Users.update({ refresh_token: [refreshToken] }, { where: { email } });
      }
      res.status(200).send({ token, refreshToken, username, id, role });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async updateTokens(req, res) {
    try {
      const { dataValues: { id, username, role, refresh_token }, token, refreshToken } = req.user;
      const oldRefreshToken = req.get('Authorization').split(' ')[1];
      const availabilityRefresh = refresh_token.find((token) => token === oldRefreshToken);
      if (availabilityRefresh) {
        const newRefreshTokens = refresh_token.filter((token) => token !== oldRefreshToken);
        newRefreshTokens.push(refreshToken);
        await Users.update({ refresh_token: newRefreshTokens }, { where: { id } });
      } else {
        throw new Error('Ошибка доступа');
      } 
      res.status(200).send({ id, username, role, token, refreshToken });
    } catch (e) {
      console.log(e);
      res.sendStatus(401);
    }
  }

  async confirmAuth(req, res) {
    try {
      res.status(200).json({ status: 'ok' });
    } catch (e) {
      console.log(e);
      res.sendStatus(401);
    }
  }

  async removeAuth(req, res) {
    try {
      const { id, refreshToken } = req.body;
      const { dataValues: { refresh_token } } = await Users.findOne({
        attributes: ['refresh_token'],
        where: { id },
      });
      if (refresh_token) {
        const refreshTokens = refresh_token.filter((token) => token !== refreshToken);
        const newRefreshTokens = refreshTokens.length > 0 ? refreshTokens : null;
        await Users.update({ refresh_token: newRefreshTokens }, { where: { id } });
      }
      res.json({ status: 'Tokens has been deleted' });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

const Auth = new Authentication();

module.exports = Auth;