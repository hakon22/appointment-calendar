const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = process.env.DB === 'LOCAL' ? new Sequelize(process.env.DB_LOCAL) : new Sequelize("postgres://hakon22:ZMG5aNQoGQIq8F06GAFzAFeXaTfxeVJ3@dpg-cif043tgkuvq1o378440-a:5432/test_t055");

const connectToDb = async () => {
  try {
    await db.authenticate();
    await db.sync();
    console.log('Соединение с БД было успешно установлено');
  } catch (e) {
    console.log('Невозможно выполнить подключение к БД: ', e);
  }
};

module.exports = { db, connectToDb };