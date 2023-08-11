const apiPath = '/api';

export default {
  homePage: '/',
  loginPage: '/login',
  signupPage: '/signup',
  notFoundPage: '*',
  login: [apiPath, 'login'].join('/'),
  signup: [apiPath, 'signup'].join('/'),
  auth: [apiPath, 'auth'].join('/'),
  deleteAuth: [apiPath, 'delete-auth'].join('/'),
  dateTime: [apiPath, 'date-time/'].join('/'),
  checkRole: [apiPath, 'get-role'].join('/'),
  add: [apiPath, 'data-add'].join('/'),
  delete: [apiPath, 'data-delete/'].join('/'),
};
