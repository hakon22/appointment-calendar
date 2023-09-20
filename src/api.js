const express = require('express');
const passport = require('passport');
const Auth = require('./authentication/Auth.js');
const { Act } = require('./activation/Activation.js');
const Calendar = require('./calendar/Calendar.js');
const UserData = require('./userData/UserData.js');

const router = express.Router();

// user
router.post('/calendar/api/signup', Auth.signup);
router.post('/calendar/api/login', Auth.login);
router.get('/calendar/api/get-role', passport.authenticate('jwt-refresh', { session: false }), Auth.updateTokens);
router.post('/calendar/api/delete-auth', Auth.removeAuth);
router.post('/calendar/api/recording', passport.authenticate('jwt', { session: false }), Calendar.recording);
router.post('/calendar/api/change-pass', passport.authenticate('jwt', { session: false }), UserData.changePass);
router.post('/calendar/api/change-user-data', passport.authenticate('jwt', { session: false }), UserData.changeUserData);
router.get('/calendar/api/cancel-change-email', passport.authenticate('jwt', { session: false }), UserData.cancelChangeEmail);
router.post('/calendar/api/recovery-password', Auth.recoveryPassword);

// activation
router.post('/calendar/api/activation/', Act.activation);
router.get('/calendar/api/activation/:id', Act.needsActivation);
router.get('/calendar/api/activation/repeat-email/:id', Act.repeatEmail);
router.post('/calendar/api/activation/change-email', Act.changeEmail);

// date
router.post('/calendar/api/date/get-date', passport.authenticate('jwt', { session: false }), Calendar.getDate);
router.post('/calendar/api/date/set-date', passport.authenticate('jwt', { session: false }), Calendar.setDate);
router.patch('/calendar/api/date/change-time', passport.authenticate('jwt', { session: false }), Calendar.changeTime);
router.patch('/calendar/api/date/add-new-time', passport.authenticate('jwt', { session: false }), Calendar.addNewTime);
router.delete('/calendar/api/date/remove-time', passport.authenticate('jwt', { session: false }), Calendar.removeTime);
router.delete('/calendar/api/date/remove-date', passport.authenticate('jwt', { session: false }), Calendar.removeDate);
router.patch('/calendar/api/date/remove-record', passport.authenticate('jwt', { session: false }), Calendar.removeRecord);

module.exports = router;
