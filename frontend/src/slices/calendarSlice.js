import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';

export const fetchDate = createAsyncThunk(
  'calendar/fetchDate',
  async ({ token, date }) => {
    const response = await axios.post(routes.getAdminDate, date, {
      headers: { Authorization: `Bearer ${token}` },
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
    removeData: calendarAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDate.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchDate.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(fetchDate.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectors = calendarAdapter.getSelectors((state) => state.calendar);
export const { actions } = calendarSlice;
export default calendarSlice.reducer;
