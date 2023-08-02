import { Provider } from 'react-redux';
import { useMemo, useCallback, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import { io } from 'socket.io-client';
import store from '../slices/index.js';
import Calendar from './Calendar.jsx';
import NavBar from './NavBar.jsx';
import Page404 from './Page404.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import { actions } from '../slices/calendarSlice.js';
import ApiContext, { AuthContext } from './Context.jsx';
import routes from '../routes.js';

const App = () => {
  const isMobile = window.screen.width <= 768;
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setLoggedIn(false);
    window.location.href = routes.loginPage;
  };

  const authServices = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]);

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
      <AuthContext.Provider value={authServices}>
        <ApiContext.Provider value={socketApi}>
          <NavBar />
          <hr />
          <div className="container">
            <div className="row d-flex justify-content-center">
              <BrowserRouter>
                <ToastContainer />
                <Routes>
                  <Route
                    path={routes.homePage}
                    element={loggedIn
                      ? <Calendar isMobile={isMobile} />
                      : <Navigate to={routes.loginPage} />}
                  />
                  <Route path={routes.loginPage} element={<Login />} />
                  <Route path={routes.signupPage} element={<Signup />} />
                  <Route path={routes.notFoundPage} element={<Page404 />} />
                </Routes>
              </BrowserRouter>
            </div>
          </div>
          <hr className="mb-4" />
        </ApiContext.Provider>
      </AuthContext.Provider>
    </Provider>
  );
};

export default App;
