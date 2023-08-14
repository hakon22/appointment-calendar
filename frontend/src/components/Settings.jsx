import { useCallback, useMemo } from 'react';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import { actions } from '../slices/calendarSlice.js';
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
    addLike: (like) => socketConnect('addLike', like),
    removeLike: (like) => socketConnect('removeLike', like),
    addData: (data) => socketConnect('addData', data),
    removeData: (data) => socketConnect('removeData', data),
  }), [socketConnect]);

  socket.on('addData', (data) => store.dispatch(actions.addData(data)));
  socket.on('removeData', (data) => store.dispatch(actions.removeData(data)));
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
