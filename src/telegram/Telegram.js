const request = require('request');

class Telegram {

  sendMessageAfterRecord(username, email, phone, stringDate, time) {
    const fields = [
      '‼️<b>Новая запись</b>‼️',
      `<b>Дата</b>: ${stringDate}`,
      `<b>Время</b>: ${time}`,
      `<b>Имя</b>: ${username}`,
      `<b>Почта</b>: ${email}`,
      `<b>Телефон</b>: ${phone}`,
    ];
    const msg = encodeURI(fields.reduce((acc, field) => acc += `${field}\n`, ''));
    request.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&parse_mode=html&text=${msg}`, (error, response) => {
      if (response.statusCode === 200) {
        console.log('Сообщение в Telegram отправлено!');
      } else {
        console.log('Ошибка отправки сообщения в Telegram :(');
      }
    });
  }

  sendMessageCancelRecord(username, email, phone, stringDate, time) {
    const fields = [
      '😕<b>Отмена записи!</b>😕',
      `<b>Дата</b>: ${stringDate}`,
      `<b>Время</b>: ${time}`,
      `<b>Имя</b>: ${username}`,
      `<b>Почта</b>: ${email}`,
      `<b>Телефон</b>: ${phone}`,
    ];
    const msg = encodeURI(fields.reduce((acc, field) => acc += `${field}\n`, ''));
    request.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&parse_mode=html&text=${msg}`, (error, response) => {
      if (response.statusCode === 200) {
        console.log('Сообщение в Telegram отправлено!');
      } else {
        console.log('Ошибка отправки сообщения в Telegram :(');
      }
    });
  }
}

module.exports = new Telegram();