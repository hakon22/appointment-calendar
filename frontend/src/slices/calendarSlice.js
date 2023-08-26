import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes.js';

export const fetchDate = createAsyncThunk(
  'calendar/fetchDate',
  async ({ token, date, stringDate }) => {
    const response = await axios.post(routes.getDate, { date, stringDate }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    loadingStatus: 'idle', error: null, currentDate: '',
  },
  reducers: {
    soketAddNewDate: (state, { payload: { date, time } }) => {
      if (date === state.currentDate) {
        state.time = time;
      }
    },
    soketChangeTime: (state, { payload }) => {
      state.time = payload;
    },
    soketAddNewTime: (state, { payload }) => {
      state.time = payload;
    },
    soketRemoveTime: (state, { payload }) => {
      state.time = payload;
    },
    soketRemoveDate: (state, { payload }) => {
      if (payload === state.currentDate) {
        state.time = '';
      }
    },
    soketRecording: (state, { payload }) => {
      state.time[payload] = true;
    },
    removeData: (state) => {
      const entries = Object.keys(state);
      entries.forEach((key) => {
        if (key !== 'loadingStatus') {
          state[key] = '';
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDate.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchDate.fulfilled, (state, { payload }) => {
        const { data } = payload;
        state.currentDate = data.date;
        state.time = data.time;
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(fetchDate.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  soketAddNewDate,
  soketChangeTime,
  soketAddNewTime,
  soketRemoveTime,
  soketRemoveDate,
  soketRecording,
  removeData,
} = calendarSlice.actions;
export default calendarSlice.reducer;
