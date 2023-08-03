const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const Auth = require('./authentication/Auth.js');
const Date_Times = require('./db/tables/Date_Times.js');
const Users = require('./db/tables/Users.js');

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/api/date-add', async (req, res) => {
  try {
    const { date, open_time, close_time } = req.body;
    const todo = await Date_Times.create({ date, open_time, close_time });
    res.status(200).send(todo);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/api/signup', Auth.signup);

router.post('/api/login', Auth.login);

// router.post('/api/login', passport.authenticate('jwt', { session: false }), Auth.login);

router.delete('/api/data-delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Date_Times.destroy({ where: { id } });
    res.status(200).sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/api/data-addLike/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Date_Times.increment('likes', { where: { id } });
    res.status(200).sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/api/data-removeLike/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Date_Times.decrement('likes', { where: { id } });
    res.status(200).sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/api/date-time/:date', async (req, res) => {
  try {
    const todo = await Date_Times.findAll({
      attributes: ['open_time', 'close_time'],
      where: { date },
    });
    res.status(200).send(todo);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/api/role/:email', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const todo = await Users.findOne({
      attributes: ['role'],
      where: { email },
    });
    res.status(200).send(todo);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/api/auth', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    res.json({ status: 'ok' });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
