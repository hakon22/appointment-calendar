const express = require('express');
const passport = require('passport');
const { Auth } = require('./authentication/Auth.js');
const Date_Times = require('./db/tables/Date_Times.js');
const Users = require('./db/tables/Users.js');

const router = express.Router();

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

router.get('/api/get-role', passport.authenticate('jwt-refresh', { session: false }), async (req, res) => {
  try {
    const { dataValues: { id, username, role, refresh_token }, token, refreshToken } = req.user;
    const oldRefreshToken = req.get('Authorization').split(' ')[1];
    if (refresh_token) {
      const newRefreshTokens = refresh_token.filter((token) => token !== oldRefreshToken);
      newRefreshTokens.push(refreshToken);
      await Users.update({ refresh_token: newRefreshTokens }, { where: { id } });
    }
    res.status(200).send({ id, username, role, token, refreshToken });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/api/delete-auth', async (req, res) => {
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
});

router.get('/api/auth', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    res.status(200).json({ status: 'ok' });
  } catch (e) {
    console.log(e);
    res.sendStatus(401);
  }
});

module.exports = router;
