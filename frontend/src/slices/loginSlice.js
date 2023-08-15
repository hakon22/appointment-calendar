import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';

export const fetchLogin = createAsyncThunk(
  'login/fetchLogin',
  async (data) => {
    const response = await axios.post(routes.login, data);
    return response.data;
  },
);

export const fetchToken = createAsyncThunk(
  'login/fetchToken',
  async (token) => {
    const response = await axios.get(routes.auth, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
);

export const fetchActivation = createAsyncThunk(
  'login/fetchActivation',
  async (id) => {
    const response = await axios.get(`${routes.activation}${id}`);
    return response.data;
  },
);

export const fetchTokenStorage = createAsyncThunk(
  'login/fetchTokenStorage',
  async (refreshTokenStorage) => {
    const response = await axios.get(routes.checkRole, {
      headers: { Authorization: `Bearer ${refreshTokenStorage}` },
    });
    return response.data;
  },
);

export const updateTokens = createAsyncThunk(
  'login/updateTokens',
  async (refresh) => {
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
  },
);

const loginSlice = createSlice({
  name: 'login',
  initialState: { loadingStatus: 'idle', error: null },
  reducers: {
    removeToken: (state) => {
      const entries = Object.keys(state);
      entries.forEach((key) => {
        if (key !== 'loadingStatus') {
          state[key] = null;
        }
      });
    },
    addTokenStorage: (state, { payload }) => {
      if (payload.refreshToken) {
        const entries = Object.entries(payload);
        entries.forEach(([key, value]) => { state[key] = value; });
        state.error = null;
      }
    },
    changeEmailActivation: (state, { payload }) => {
      state.email = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, { payload }) => {
        if (payload.token) {
          const entries = Object.entries(payload);
          entries.forEach(([key, value]) => { state[key] = value; });
        }
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchToken.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchToken.fulfilled, (state) => {
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(fetchToken.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTokenStorage.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchTokenStorage.fulfilled, (state, { payload }) => {
        if (payload.refreshToken) {
          if (window.localStorage.getItem('refresh_token')) {
            window.localStorage.setItem('refresh_token', payload.refreshToken);
          }
          const entries = Object.entries(payload);
          entries.forEach(([key, value]) => { state[key] = value; });
        }
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(fetchTokenStorage.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateTokens.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(updateTokens.fulfilled, (state, { payload }) => {
        if (payload.token) {
          const entries = Object.entries(payload);
          entries.forEach(([key, value]) => { state[key] = value; });
        }
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(updateTokens.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchActivation.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchActivation.fulfilled, (state, { payload }) => {
        state.loadingStatus = payload ? 'finish' : 'failed';
        state.error = null;
        if (payload) {
          state.email = payload;
        }
      })
      .addCase(fetchActivation.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { removeToken, addTokenStorage, changeEmailActivation } = loginSlice.actions;
export default loginSlice.reducer;
