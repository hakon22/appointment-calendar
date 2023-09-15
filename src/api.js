const express = require('express');
const passport = require('passport');
const Auth = require('./authentication/Auth.js');
const { Act } = require('./activation/Activation.js');
const Calendar = require('./calendar/Calendar.js');
const UserData = require('./userData/UserData.js');

const router = express.Router();

// user
router.post('/api/signup', Auth.signup);
router.post('/api/login', Auth.login);
router.get('/api/get-role', passport.authenticate('jwt-refresh', { session: false }), Auth.updateTokens);
router.post('/api/delete-auth', Auth.removeAuth);
router.get('/api/auth', passport.authenticate('jwt', { session: false }), Auth.confirmAuth);
router.post('/api/recording', passport.authenticate('jwt', { session: false }), Calendar.recording);
router.post('/api/change-pass', passport.authenticate('jwt', { session: false }), UserData.changePass);
router.post('/api/change-user-data', passport.authenticate('jwt', { session: false }), UserData.changeUserData);
router.get('/api/cancel-change-email', passport.authenticate('jwt', { session: false }), UserData.cancelChangeEmail);

// activation
router.post('/api/activation/', Act.activation);
router.get('/api/activation/:id', Act.needsActivation);
router.get('/api/activation/repeat-email/:id', Act.repeatEmail);
router.post('/api/activation/change-email', Act.changeEmail);

// date
router.post('/api/date/get-date', passport.authenticate('jwt', { session: false }), Calendar.getDate);
router.post('/api/date/set-date', passport.authenticate('jwt', { session: false }), Calendar.setDate);
router.patch('/api/date/change-time', passport.authenticate('jwt', { session: false }), Calendar.changeTime);
router.patch('/api/date/add-new-time', passport.authenticate('jwt', { session: false }), Calendar.addNewTime);
router.delete('/api/date/remove-time', passport.authenticate('jwt', { session: false }), Calendar.removeTime);
router.delete('/api/date/remove-date', passport.authenticate('jwt', { session: false }), Calendar.removeDate);
router.patch('/api/date/remove-record', passport.authenticate('jwt', { session: false }), Calendar.removeRecord);

module.exports = router;
