import { Provider } from 'react-redux';
import { useMemo, useCallback } from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import store from '../slices/index.js';
import Calendar from './Calendar.jsx';
import { actions } from '../slices/calendarSlice.js';
import ApiContext from './Context.jsx';

const App = () => {
  const isMobile = window.screen.width <= 768;

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

  socket.on('addLike', (data) => store.dispatch(actions.addLike(data)));
  socket.on('removeLike', (data) => store.dispatch(actions.removeLike(data)));
  socket.on('addData', (data) => store.dispatch(actions.addData(data)));
  socket.on('removeData', (data) => store.dispatch(actions.removeData(data)));

  return (
    <Provider store={store}>
      <ApiContext.Provider value={socketApi}>
        <hr className="mt-4" />
        <div className="container">
          <div className="row d-flex justify-content-center">
            <BrowserRouter>
              <ToastContainer />
              <Routes>
                <Route path="/" element={<Calendar isMobile={isMobile} />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
        <hr className="mb-4" />
      </ApiContext.Provider>
    </Provider>
  );
};

export default App;
