import { configureStore } from '@reduxjs/toolkit';
import calendarReducer from './calendarSlice.js';

export default configureStore({
  reducer: {
    calendar: calendarReducer,
  },
});
