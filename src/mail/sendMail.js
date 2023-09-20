const nodemailer = require('nodemailer');
const { upperCase, lowerCase } = require('../utilities/textTransform.js');

const protocol = 'https://';
const siteName = 'portfolio.am-projects.ru/calendar';
const activationPage = '/activation/';

const transport = nodemailer.createTransport({
  host: "smtp.beget.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.LOGIN_MAIL,
    pass: process.env.PASS_MAIL,
  },
});

const sendMailActivationAccount = async (id, username, email, code) => {
  const to = lowerCase(email);
  const subject = `Код подтверждения регистрации на сайте ${siteName}`;

  await transport.sendMail({
    from: process.env.LOGIN, to,
    subject,
    html: `
      <h3>Уважаемый ${upperCase(username)}!</h3>
      <h4>Ранее вы регистрировались на сайте ${protocol}${siteName}.</h4>
      <p>Ваш код подтверждения: <h3><b>${code}</b></h3></p>
      <p>Вы можете ввести его здесь: <a href="${protocol}${siteName}${activationPage}${id}" target="_blank">${protocol}${siteName}${activationPage}${id}</a></p>
      <p>Данный код действует 24 часа, после истечения времени Ваша регистрация будет аннулирована.</p>
      <p>Если Вы не регистрировались на нашем сайте - просто проигнорируйте это письмо.</p>
      <p>С уважением, администрация <a href="${protocol}${siteName}" target="_blank">${siteName}</a></p>
    `
  }, (error) => {
    if (error) {
      console.error('Ошибка при отправке:', error);
    } else {
      console.log('Сообщение отправлено!');
    }
  });
}

const sendMailChangeEmail = async (username, email, code) => {
  const to = lowerCase(email);
  const subject = `Код подтверждения изменения почты на сайте ${siteName}`;

  await transport.sendMail({
    from: process.env.LOGIN, to,
    subject,
    html: `
      <h3>Уважаемый ${upperCase(username)}!</h3>
      <h4>С Вашего аккаунта был послан запрос на смену почты на сайте ${protocol}${siteName}.</h4>
      <p>Ваш код подтверждения: <h3><b>${code}</b></h3></p>
      <p>Если это были не Вы, пожалуйста, смените пароль в личном кабинете.</p>
      <p>С уважением, администрация <a href="${protocol}${siteName}" target="_blank">${siteName}</a></p>
    `
  }, (error) => {
    if (error) {
      console.error('Ошибка при отправке:', error);
    } else {
      console.log('Сообщение отправлено!');
    }
  });
}

const sendMailCancelRecording = async (username, email, date, time) => {
  const to = lowerCase(email);
  const subject = `Отмена записи на сайте ${siteName}`;

  await transport.sendMail({
    from: process.env.LOGIN, to,
    subject,
    html: `
      <h3>Уважаемый ${upperCase(username)}!</h3>
      <h4>У Вас была запись ${date} на ${time}.</h4>
      <p>К сожалению, Вас не смогут принять.</p>
      <p>Ваша запись была аннулирована.</p>
      <p>Вы можете выбрать другое время приёма на нашем сайте: <a href="${protocol}${siteName}" target="_blank">${protocol}${siteName}</a></p>
      <p>Приносим свои извинения.</p>
      <p>С уважением, администрация <a href="${protocol}${siteName}" target="_blank">${siteName}</a></p>
    `
  }, (error) => {
    if (error) {
      console.error('Ошибка при отправке:', error);
    } else {
      console.log('Сообщение отправлено!');
    }
  });
}

const sendMailRecording = async (username, email, date, time) => {
  const to = lowerCase(email);
  const subject = `Запись на сайте ${siteName}`;

  await transport.sendMail({
    from: process.env.LOGIN, to,
    subject,
    html: `
      <h3>Уважаемый ${upperCase(username)}!</h3>
      <h4>Вы успешно записаны ${date} на ${time}.</h4>
      <p>Пожалуйста, не опаздывайте!</p>
      <p>С уважением, администрация <a href="${protocol}${siteName}" target="_blank">${siteName}</a></p>
    `
  }, (error) => {
    if (error) {
      console.error('Ошибка при отправке:', error);
    } else {
      console.log('Сообщение отправлено!');
    }
  });
}

const sendMailChangePass = async (username, email, password) => {
  const to = lowerCase(email);
  const subject = `Смена пароля на сайте ${siteName}`;

  await transport.sendMail({
    from: process.env.LOGIN, to,
    subject,
    html: `
      <h3>Уважаемый ${upperCase(username)}!</h3>
      <h4>Ваш пароль был изменён.</h4>
      <p>Если это были не Вы, пожалуйста, смените пароль в личном кабинете.</p>
      <p>Ваш новый пароль: <h3><b>${password}</b></h3></p>
      <p>С уважением, администрация <a href="${protocol}${siteName}" target="_blank">${siteName}</a></p>
    `
  }, (error) => {
    if (error) {
      console.error('Ошибка при отправке:', error);
    } else {
      console.log('Сообщение отправлено!');
    }
  });
}

const sendMailRecoveryPass = async (username, email, password) => {
  const to = lowerCase(email);
  const subject = `Восстановление пароля на сайте ${siteName}`;

  await transport.sendMail({
    from: process.env.LOGIN, to,
    subject,
    html: `
      <h3>Уважаемый ${upperCase(username)}!</h3>
      <h4>Вы запросили восстановление пароля.</h4>
      <p>Если это были не Вы, пожалуйста, смените пароль в личном кабинете.</p>
      <p>Ваш новый пароль: <h3><b>${password}</b></h3></p>
      <p>С уважением, администрация <a href="${protocol}${siteName}" target="_blank">${siteName}</a></p>
    `
  }, (error) => {
    if (error) {
      console.error('Ошибка при отправке:', error);
    } else {
      console.log('Сообщение отправлено!');
    }
  });
}

module.exports = {
  sendMailActivationAccount,
  sendMailCancelRecording,
  sendMailRecording,
  sendMailChangePass,
  sendMailChangeEmail,
  sendMailRecoveryPass,
};
