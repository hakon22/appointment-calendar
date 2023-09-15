const bcrypt = require('bcryptjs');
const Users = require('../db/tables/Users.js');
const Date_Times = require('../db/tables/Date_Times.js');
const { codeGen } = require('../activation/Activation.js');
const { sendMailChangePassSuccess, sendMailChangeEmail } = require('../mail/sendMail.js');

class UserData {

  async changePass(req, res) {
    try {
      const { dataValues: { id, username, email, password } } = req.user;
      const values = req.body;
      const isValidPassword = bcrypt.compareSync(values.password, password);
      if (values.continueChangePass) {
        if (isValidPassword) {
          res.json({ code: 3 });
        } else {
          const hashPassword = bcrypt.hashSync(values.password, 10);
          await Users.update({ password: hashPassword }, { where: { id } });
          await sendMailChangePassSuccess(username, email, values.password);
          res.json({ code: 4 });
        }
      } else {
        if (!isValidPassword) {
          res.json({ code: 2 });
        } else {
          res.json({ code: 1 });
        }
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async changeUserData(req, res) {
    try {
      const { dataValues: { id, username, email, record, change_email_code } } = req.user;
      const values = req.body;

      const changeData = async (values) => {
        const datesRecords = Object.keys(record);
        if (datesRecords.length) {
          datesRecords.forEach(async (date) => {
            const { dataValues: { time } } = await Date_Times.findOne({ where: { date } });
            const timesRecords = Object.entries(time);
            const newTime = timesRecords.reduce((acc, [time, data]) => {
              if (data && data.user.id === id) {
                const [key, value] = Object.entries(values)[0];
                data.user[key] = value;
              }
              return { ...acc, [time]: data };
            }, {});
            await Date_Times.update({ time: newTime }, { where: { date } });
          });
        }
        await Users.update(values, { where: { id } });
        return res.json({ code: 1 });
      };

      if (values.code) {
        if (change_email_code === Number(values.code)) {
          return await changeData({ email: values.email, change_email_code: null });
        }
        return res.status(200).send({ code: 4 });
      }
      if (values.email) {
        const users = await Users.findAll({
          attributes: ['email'],
        });
        if (users.find((user) => user.email === values.email)) {
          return res.status(200).send({ code: 2 });
        }
        const code = codeGen();
        await Users.update({ change_email_code: code }, { where: { id } });
        await sendMailChangeEmail(username, values.email, code);
        return res.json({ code: 3 });
      }
      return await changeData(values);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async cancelChangeEmail(req, res) {
    try {
      const { dataValues: { id } } = req.user;
      await Users.update({ change_email_code: null }, { where: { id } });
      res.status(200).json({ status: 'ok' });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

module.exports = new UserData();