const apiPath = '/api';

export default {
  homePage: '/',
  loginPage: '/login',
  signupPage: '/signup',
  notFoundPage: '*',
  login: [apiPath, 'login'].join('/'),
  signup: [apiPath, 'signup'].join('/'),
  add: [apiPath, 'data-add'].join('/'),
  all: [apiPath, 'time-all/'].join('/'),
  delete: [apiPath, 'data-delete/'].join('/'),
  addLike: [apiPath, 'data-addLike/'].join('/'),
  removeLike: [apiPath, 'data-removeLike/'].join('/'),
};
