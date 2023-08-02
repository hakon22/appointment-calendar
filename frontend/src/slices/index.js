import { configureStore } from '@reduxjs/toolkit';
import calendarReducer from './calendarSlice.js';
import loginReducer from './loginSlice.js';

export default configureStore({
  reducer: {
    calendar: calendarReducer,
    login: loginReducer,
  },
});
