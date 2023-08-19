const express = require('express');
const passport = require('passport');
const Auth = require('./authentication/Auth.js');
const { Act } = require('./activation/Activation.js');
const Date_Times = require('./db/tables/Date_Times.js');

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

router.get('/api/get-role', passport.authenticate('jwt-refresh', { session: false }), Auth.updateTokens);

router.post('/api/delete-auth', Auth.removeAuth);

router.get('/api/auth', passport.authenticate('jwt', { session: false }), Auth.confirmAuth);

router.get('/api/get-admin-date', passport.authenticate('jwt', { session: false }), Auth.getAdminDate);

router.post('/api/activation/', Act.activation);

router.get('/api/activation/:id', Act.needsActivation);

router.get('/api/activation/repeat-email/:id', Act.repeatEmail);

router.post('/api/activation/change-email', Act.changeEmail);

module.exports = router;
