const express = require('express');
const passport = require('passport');
const Auth = require('./authentication/Auth.js');
const { Act } = require('./activation/Activation.js');
const CalendarHandler = require('./calendar/Calendar.js');
const Date_Times = require('./db/tables/Date_Times.js');

const router = express.Router();

router.post('/api/signup', Auth.signup);
router.post('/api/login', Auth.login);
router.get('/api/get-role', passport.authenticate('jwt-refresh', { session: false }), Auth.updateTokens);
router.post('/api/delete-auth', Auth.removeAuth);
router.get('/api/auth', passport.authenticate('jwt', { session: false }), Auth.confirmAuth);
router.post('/api/date/get-date', passport.authenticate('jwt', { session: false }), CalendarHandler.getDate);
router.post('/api/date/set-date', passport.authenticate('jwt', { session: false }), CalendarHandler.setDate);
router.patch('/api/date/change-time', passport.authenticate('jwt', { session: false }), CalendarHandler.changeTime);
router.patch('/api/date/add-new-time', passport.authenticate('jwt', { session: false }), CalendarHandler.addNewTime);
router.delete('/api/date/remove-time', passport.authenticate('jwt', { session: false }), CalendarHandler.removeTime);
router.delete('/api/date/remove-date', passport.authenticate('jwt', { session: false }), CalendarHandler.removeDate);
router.patch('/api/date/remove-record', passport.authenticate('jwt', { session: false }), CalendarHandler.removeRecord);
router.post('/api/recording', passport.authenticate('jwt', { session: false }), CalendarHandler.recording);
router.post('/api/activation/', Act.activation);
router.get('/api/activation/:id', Act.needsActivation);
router.get('/api/activation/repeat-email/:id', Act.repeatEmail);
router.post('/api/activation/change-email', Act.changeEmail);

module.exports = router;
