const nodemailer = require('nodemailer');
const { upperCase, lowerCase } = require('../utilities/textTransform.js');
require('dotenv').config();

const siteName = 'localhost:3000';
const activationPage = '/activation/';

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.LOGIN_MAIL,
    pass: process.env.PASS_MAIL,
  },
});

const sendMail = async (id, username, email, code) => {
  const to = lowerCase(email);
  const subject = `Код подтверждения регистрации на сайте ${siteName}`;

  await transport.sendMail({
    from: process.env.LOGIN, to,
    subject,
    html: `
      <h3>Уважаемый ${upperCase(username)}!</h3>
      <h4>Ранее вы регистрировались на сайте ${siteName}.</h4>
      <p>Ваш код подтверждения: <h3><b>${code}</b></h3></p>
      <p>Вы можете ввести его здесь: <a href="${siteName}${activationPage}${id}" target="_blank">${siteName}${activationPage}${id}</a></p>
      <p>Если Вы не регистрировались на нашем сайте - просто проигнорируйте это письмо.</p>
    `
  }, (error, data) => {
    if (error) {
      console.error('Ошибка при отправке:', error);
    } else {
      console.log('Сообщение отправлено!');
    }
  });
}

module.exports = sendMail;
