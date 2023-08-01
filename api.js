const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

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
    time: {
      type: DataTypes.ARRAY(DataTypes.TIME),
      allowNull: false,
    },
    time: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    alcohol: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    transfer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    children: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    beds: {
      type: DataTypes.STRING,
      allowNull: false,
    },    
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.STRING,
      defaultValue: () => {
        const date = new Date();
        return date.toLocaleString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
      },
    },
    updatedAt: {
      type: DataTypes.STRING,
      defaultValue: () => {
        const date = new Date();
        return date.toLocaleString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
      },
    },
  },
  {
    timestamps: false,
  },
);

router.post('/api/data-add', jsonParser, async (req, res) => {
  try {
    const { name, phone, foods, alcohol, transfer, children, beds } = req.body;
    const todo = await Calendar.create({ name, phone, foods, alcohol, transfer, children, beds });
    res.status(200).send(todo);
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

router.get('/api/data-all', jsonParser, async (req, res) => {
  try {
    const todo = await Calendar.findAll();
    res.status(200).send(todo);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = { router, db };
