const apiPath = '/api';

export default {
  add: [apiPath, 'data-add'].join('/'),
  all: [apiPath, 'data-all'].join('/'),
  delete: [apiPath, 'data-delete/'].join('/'),
  addLike: [apiPath, 'data-addLike/'].join('/'),
  removeLike: [apiPath, 'data-removeLike/'].join('/'),
};
