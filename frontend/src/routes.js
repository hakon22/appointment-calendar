const apiPath = navigator.userAgent === 'ReactSnap' ? 'http://0.0.0.0:3003/api' : '/api';

export default {
  homePage: '/',
  loginPage: '/login',
  signupPage: '/signup',
  activationPage: '/activation/:id',
  activationUrlPage: '/activation/',
  notFoundPage: '*',
  login: [apiPath, 'login'].join('/'),
  signup: [apiPath, 'signup'].join('/'),
  activation: [apiPath, 'activation/'].join('/'),
  activationRepeatEmail: [apiPath, 'activation/repeat-email/'].join('/'),
  activationChangeEmail: [apiPath, 'activation/change-email'].join('/'),
  auth: [apiPath, 'auth'].join('/'),
  deleteAuth: [apiPath, 'delete-auth'].join('/'),
  getDate: [apiPath, 'date/get-date'].join('/'),
  setDate: [apiPath, 'date/set-date'].join('/'),
  removeDate: [apiPath, 'date/remove-date'].join('/'),
  changeTime: [apiPath, 'date/change-time'].join('/'),
  addNewTime: [apiPath, 'date/add-new-time'].join('/'),
  removeTime: [apiPath, 'date/remove-time'].join('/'),
  checkRole: [apiPath, 'get-role'].join('/'),
};
