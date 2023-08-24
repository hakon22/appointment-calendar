const { getDigitalCode } = require('node-verification-code');
const Users = require('../db/tables/Users.js');
const { sendMail } = require('../mail/sendMail.js');
const { generateRefreshToken } = require('../authentication/tokensGen.js');

const codeGen = () => getDigitalCode(4).toString();

class Activation {

  async needsActivation(req, res) {
    try {
      const { id } = req.params;
      const user = await Users.findOne({
        attributes: ['email', 'code_activation'],
        where: { id },
      });
      const { code_activation } = user ?? '';
      if (code_activation !== '' && user) {
        const { email } = user;
        res.status(200).send(email);
      } else {
        res.status(200).send(false);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async activation(req, res) {
    try {
      const { id, code } = req.body;
      const user = await Users.findOne({
        attributes: ['email', 'code_activation'],
        where: { id },
      });
      const { code_activation } = user ?? '';
      if (code_activation !== '' && user) {
        const { email } = user;
        if (code_activation === Number(code)) {
          const refreshToken = generateRefreshToken(id, email);
          await Users.update({ refresh_token: [refreshToken], code_activation: null }, { where: { id } });
          res.status(200).send({ code: 1, refreshToken });
        } else if (code_activation !== Number(code)) {
          res.status(200).send({ code: 2, message: 'Неверный код подтверждения' });
        }
      } else {
        res.status(200).send(false);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async repeatEmail(req, res) {
    try {
      const { id } = req.params;
      const user = await Users.findOne({
        attributes: ['username', 'email', 'code_activation'],
        where: { id },
      });
      const { code_activation } = user ?? '';
      if (code_activation !== '' && user) {
        const { username, email } = user;
        const newCode = codeGen();
        await Users.update({ code_activation: newCode }, { where: { id } });
        await sendMail(id, username, email, newCode);
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async changeEmail(req, res) {
    try {
      const { id, email } = req.body;
      const users = await Users.findAll({
        attributes: ['id', 'username', 'email', 'code_activation'],
      });
      const user = users.find((user) => user.id === Number(id));
      const { code_activation } = user ?? '';
      if (code_activation !== '' && user) {
        const emails = users.map((user) => user.email);
        if (!emails.includes(email)) {
          const newCode = codeGen();
          const { username } = user;
          await Users.update({ email, code_activation: newCode }, { where: { id } });
          await sendMail(id, username, email, newCode);
          res.status(200).send({ code: 1 });
        } else {
          res.status(200).send({ code: 2, message: 'Такой email уже существует' });
        }
      } else {
        res.status(200).send(false);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

const Act = new Activation();

module.exports = { Act, codeGen };