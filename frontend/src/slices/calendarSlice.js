import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';

export const fetchTokenStorage = createAsyncThunk(
  'calendar/fetchTokenStorage',
  async (refreshTokenStorage) => {
    const response = await axios.get(routes.checkRole, {
      headers: { Authorization: `Bearer ${refreshTokenStorage}` },
    });
    return response.data;
  },
);

const calendarAdapter = createEntityAdapter({});

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: calendarAdapter.getInitialState({
    loadingStatus: 'idle', error: null,
  }),
  reducers: {
    addData: calendarAdapter.addOne,
    addLike: (state, { payload }) => {
      state.entities[payload].likes += 1;
    },
    removeLike: (state, { payload }) => {
      state.entities[payload].likes -= 1;
    },
    removeData: calendarAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokenStorage.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchTokenStorage.fulfilled, (state) => {
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(fetchTokenStorage.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectors = calendarAdapter.getSelectors((state) => state.calendar);
export const { actions } = calendarSlice;
export default calendarSlice.reducer;
