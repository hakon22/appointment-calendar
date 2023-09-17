import {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import axios from 'axios';
import notify from '../utilities/toast.js';
import Calendar from '../pages/Calendar.jsx';
import NavBar from './NavBar.jsx';
import Page404 from '../pages/Page404.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import Activation from '../pages/Activation.jsx';
import Recovery from '../pages/Recovery.jsx';
import { AuthContext } from './Context.jsx';
import routes from '../routes.js';
import { fetchTokenStorage, removeToken } from '../slices/loginSlice.js';
import { removeData } from '../slices/calendarSlice.js';

const App = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id, token, error } = useSelector((state) => state.login);
  const calendarError = useSelector((state) => state.calendar.error);
  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = useCallback(async () => {
    const refreshTokenStorage = window.localStorage.getItem('refresh_token');
    if (refreshTokenStorage) {
      localStorage.removeItem('refresh_token');
    }
    await axios.post(routes.deleteAuth, { id, refreshTokenStorage });
    dispatch(removeToken());
    setLoggedIn(false);
    dispatch(removeData());
  }, [dispatch, id]);

  const authServices = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn, logOut]);

  useEffect(() => {
    const tokenStorage = window.localStorage.getItem('refresh_token');
    if (tokenStorage) {
      dispatch(fetchTokenStorage(tokenStorage));
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      logIn();
    }
  }, [token]);

  useEffect(() => {
    const errorHandler = (err) => {
      if (parseInt(err.match(/\d+/), 10) === 401) {
        logOut();
        notify(t('toast.authError'), 'error');
      }
      if (parseInt(err.match(/\d+/), 10) === 500) {
        notify(t('toast.unknownError'), 'error');
      }
      console.log(err);
    };

    if (error) {
      errorHandler(error);
    }
    if (calendarError) {
      errorHandler(calendarError);
    }
  }, [error, calendarError, logOut, t]);

  return (
    <AuthContext.Provider value={authServices}>
      <BrowserRouter>
        <NavBar loggedIn={loggedIn} />
        <hr className="mb-4 mt-0" />
        <div className="container">
          <div className="row d-flex justify-content-center">
            <Routes>
              <Route
                path={routes.homePage}
                element={loggedIn
                  ? <Calendar />
                  : <Navigate to={routes.loginPage} />}
              />
              <Route path={routes.loginPage} element={<Login />} />
              <Route path={routes.signupPage} element={<Signup />} />
              <Route path={routes.activationPage} element={<Activation />} />
              <Route path={routes.recoveryPasswordPage} element={<Recovery />} />
              <Route path={routes.notFoundPage} element={<Page404 />} />
            </Routes>
          </div>
        </div>
        <hr className="mb-4" />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
