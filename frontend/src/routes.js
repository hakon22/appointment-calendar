const apiPath = '/api';

export default {
  homePage: '/',
  loginPage: '/login',
  signupPage: '/signup',
  notFoundPage: '*',
  login: [apiPath, 'login'].join('/'),
  signup: [apiPath, 'signup'].join('/'),
  auth: [apiPath, 'auth'].join('/'),
  dateTime: [apiPath, 'date-time/'].join('/'),
  checkRole: [apiPath, 'role/'].join('/'),
  add: [apiPath, 'data-add'].join('/'),
  delete: [apiPath, 'data-delete/'].join('/'),
  addLike: [apiPath, 'data-addLike/'].join('/'),
  removeLike: [apiPath, 'data-removeLike/'].join('/'),
};
