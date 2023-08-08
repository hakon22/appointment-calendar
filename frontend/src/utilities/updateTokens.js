import axios from 'axios';
import routes from '../routes.js';

export default async (refresh) => {
  const refreshTokenStorage = window.localStorage.getItem('refresh_token');
  if (refreshTokenStorage) {
    const { data } = await axios.get(routes.checkRole, {
      headers: { Authorization: `Bearer ${refreshTokenStorage}` },
    });
    if (data.refreshToken) {
      window.localStorage.setItem('refresh_token', data.refreshToken);
      return data;
    }
  } else {
    const { data } = await axios.get(routes.checkRole, {
      headers: { Authorization: `Bearer ${refresh}` },
    });
    if (data.refreshToken) {
      return data;
    }
  }
  return null;
};
