import { useCallback, useMemo } from 'react';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import {
  soketAddNewDate,
  soketChangeTime,
  soketAddNewTime,
  soketRemoveTime,
  soketRemoveDate,
  soketRecording,
  soketRemoveRecord,
} from '../slices/calendarSlice.js';
import { soketRemoveRecordAdmin, soketRemoveDateAdmin } from '../slices/loginSlice.js';
import store from '../slices/index.js';
import ApiContext from './Context.jsx';
import App from './App.jsx';

const Settings = () => {
  const socket = io('wss://portfolio.am-projects.ru', { path: '/calendar/socket.io' });
  const socketConnect = useCallback((param, arg) => {
    socket.emit(param, arg);
  }, [socket]);
  const socketApi = useMemo(() => ({
    soketAddNewDate: (data) => socketConnect('soketAddNewDate', data),
    soketChangeTime: (data) => socketConnect('soketChangeTime', data),
    soketAddNewTime: (data) => socketConnect('soketAddNewTime', data),
    soketRemoveTime: (data) => socketConnect('soketRemoveTime', data),
    soketRemoveDate: (data) => socketConnect('soketRemoveDate', data),
    soketRecording: (data) => socketConnect('soketRecording', data),
    soketRemoveRecord: (data) => socketConnect('soketRemoveRecord', data),
    soketRemoveRecordAdmin: (data) => socketConnect('soketRemoveRecordAdmin', data),
    soketRemoveDateAdmin: (data) => socketConnect('soketRemoveDateAdmin', data),
  }), [socketConnect]);

  socket.on('soketAddNewDate', (data) => store.dispatch(soketAddNewDate(data)));
  socket.on('soketChangeTime', (data) => store.dispatch(soketChangeTime(data)));
  socket.on('soketAddNewTime', (data) => store.dispatch(soketAddNewTime(data)));
  socket.on('soketRemoveTime', (data) => store.dispatch(soketRemoveTime(data)));
  socket.on('soketRemoveDate', (data) => store.dispatch(soketRemoveDate(data)));
  socket.on('soketRecording', (data) => store.dispatch(soketRecording(data)));
  socket.on('soketRemoveRecord', (data) => store.dispatch(soketRemoveRecord(data)));
  socket.on('soketRemoveRecordAdmin', (data) => store.dispatch(soketRemoveRecordAdmin(data)));
  socket.on('soketRemoveDateAdmin', (data) => store.dispatch(soketRemoveDateAdmin(data)));

  return (
    <Provider store={store}>
      <ApiContext.Provider value={socketApi}>
        <ToastContainer />
        <App />
      </ApiContext.Provider>
    </Provider>
  );
};

export default Settings;
