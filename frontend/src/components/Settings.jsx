import { useCallback, useMemo } from 'react';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import {
  soketAddNewDate, soketChangeTime, soketAddNewTime, soketRemoveTime,
} from '../slices/calendarSlice.js';
import store from '../slices/index.js';
import ApiContext, { MobileContext } from './Context.jsx';
import App from './App.jsx';

const Settings = () => {
  const isMobile = window.screen.width < 768;
  const socket = io();
  const socketConnect = useCallback((param, arg) => {
    socket.emit(param, arg);
  }, [socket]);
  const socketApi = useMemo(() => ({
    soketAddNewDate: (data) => socketConnect('soketAddNewDate', data),
    soketChangeTime: (data) => socketConnect('soketChangeTime', data),
    soketAddNewTime: (data) => socketConnect('soketAddNewTime', data),
    soketRemoveTime: (data) => socketConnect('soketRemoveTime', data),
  }), [socketConnect]);

  socket.on('soketAddNewDate', (data) => store.dispatch(soketAddNewDate(data)));
  socket.on('soketChangeTime', (data) => store.dispatch(soketChangeTime(data)));
  socket.on('soketAddNewTime', (data) => store.dispatch(soketAddNewTime(data)));
  socket.on('soketRemoveTime', (data) => store.dispatch(soketRemoveTime(data)));

  return (
    <Provider store={store}>
      <ApiContext.Provider value={socketApi}>
        <MobileContext.Provider value={isMobile}>
          <ToastContainer />
          <App />
        </MobileContext.Provider>
      </ApiContext.Provider>
    </Provider>
  );
};

export default Settings;
