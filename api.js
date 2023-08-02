const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const jsonParser = bodyParser.json();

const db = process.env.DB === 'LOCAL' ? new Sequelize(process.env.DB_LOCAL) : new Sequelize("postgres://hakon22:ZMG5aNQoGQIq8F06GAFzAFeXaTfxeVJ3@dpg-cif043tgkuvq1o378440-a:5432/test_t055");

const Calendar = db.define(
  'Calendar',
  {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    open_time: {
      type: DataTypes.ARRAY(DataTypes.TIME),
      allowNull: false,
    },
    close_time: {
      type: DataTypes.ARRAY(DataTypes.TIME),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

const Users = db.define(
  'Users',
  {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
);

const generateAccessToken = (id, email) => jwt.sign({ id, email }, 'putin', {expiresIn: "1h"});

router.post('/api/date-add', jsonParser, async (req, res) => {
  try {
    const { date, open_time, close_time } = req.body;
    const todo = await Calendar.create({ date, open_time, close_time });
    res.status(200).send(todo);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/api/signup', jsonParser, async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const candidate = await Users.findOne({ email });
    if (candidate) {
      return res.json({ message: 'Такой email уже существует', code: 1 });
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    await Users.create({ username, password: hashPassword, email });
    res.status(200).sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/api/login', jsonParser, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({ message: 'Такой пользователь не зарегистрирован', code: 2 });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.json({ message: 'Неверный пароль', code: 2 });
    }
    const token = generateAccessToken(user.id, user.email);
    res.status(200).send({ token });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.delete('/api/data-delete/:id', jsonParser, async (req, res) => {
  try {
    const { id } = req.params;
    await Calendar.destroy({ where: { id } });
    res.status(200).sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/api/data-addLike/:id', jsonParser, async (req, res) => {
  try {
    const { id } = req.params;
    await Calendar.increment('likes', { where: { id } });
    res.status(200).sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/api/data-removeLike/:id', jsonParser, async (req, res) => {
  try {
    const { id } = req.params;
    await Calendar.decrement('likes', { where: { id } });
    res.status(200).sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/api/time-all/:date', jsonParser, async (req, res) => {
  try {
    const todo = await Calendar.findAll({
      attributes: ['open_time', 'close_time'],
      where: { date },
    });
    res.status(200).send(todo);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = { router, db };
