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
  getAdminDate: [apiPath, 'get-admin-date'].join('/'),
  setAdminDate: [apiPath, 'set-admin-date'].join('/'),
  checkRole: [apiPath, 'get-role'].join('/'),
  add: [apiPath, 'data-add'].join('/'),
  delete: [apiPath, 'data-delete/'].join('/'),
};
