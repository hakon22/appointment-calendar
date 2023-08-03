import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';

export const fetchLogin = createAsyncThunk(
  'login/fetchLogin',
  async (data) => {
    const response = await axios.post(routes.login, data);
    return response.data;
  },
);

const loginAdapter = createEntityAdapter();

const loginSlice = createSlice({
  name: 'login',
  initialState: { loadingStatus: 'idle', error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, { payload }) => {
        const { token, username } = payload;
        if (token) {
          state.token = token;
          state.username = username;
        }
        state.loadingStatus = 'idle';
        state.error = null;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectors = loginAdapter.getSelectors((state) => state.login);
export default loginSlice.reducer;
