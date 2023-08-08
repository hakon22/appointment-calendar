import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CalendarApp from 'react-calendar';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Alert, Stack, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MobileContext, AuthContext } from '../components/Context.jsx';
import AdminPanel from '../components/AdminPanel.jsx';
import MemberPanel from '../components/MemberPanel.jsx';
import { fetchToken, addTokenStorage } from '../slices/loginSlice.js';
import updateTokens from '../utilities/updateTokens.js';
import routes from '../routes.js';

const Calendar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useContext(MobileContext);
  const { logOut } = useContext(AuthContext);
  const [date, setDate] = useState('');

  const {
    loadingStatus, token, refreshToken, role, error,
  } = useSelector((state) => state.login);

  const notify = (text, type) => toast[type](text);

  /*  const updateTokens = useCallback(async (refresh) => {
    const refreshTokenStorage = window.localStorage.getItem('refresh_token');
    if (refreshTokenStorage) {
      const { payload } = await dispatch(fetchTokenStorage(refreshTokenStorage));
      if (payload.refreshToken) {
        window.localStorage.setItem('refresh_token', payload.refreshToken);
        dispatch(addTokenStorage(payload));
      }
    } else {
      const { payload } = await dispatch(fetchTokenStorage(refresh));
      if (payload.refreshToken) {
        dispatch(addTokenStorage(payload));
      }
    }
  }, [dispatch]); */

  useEffect(() => {
    if (token) {
      dispatch(fetchToken(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (error) {
          if (parseInt(error.match(/\d+/), 10) === 401) {
            const data = await updateTokens(refreshToken);
            dispatch(addTokenStorage(data));
          }
        } else if (window.localStorage.getItem('refresh_token') !== refreshToken) {
          const data = await updateTokens(refreshToken);
          dispatch(addTokenStorage(data));
        }
      } catch (e) {
        console.log(e);
        logOut();
        navigate(routes.loginPage);
        notify(t('toast.authError'), 'error');
      }
    };
    if (refreshToken !== null) {
      fetch();
    }
  }, [dispatch, logOut, navigate, t, refreshToken, error]);

  const isAdmin = () => role === 'admin';

  return loadingStatus !== 'finish'
    ? (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" role="status" />
      </div>
    )
    : (
      <>
        <div className="col-12 col-lg-4 mb-3">
          <Stack direction="horizontal">
            <Stack>
              <Alert variant="primary" className="text-center">
                {t('calendar.alert')}
              </Alert>
              <CalendarApp
                className="w-100"
                onChange={() => setDate(new Date())}
                value={date}
                tileClassName={({ view }) => (view === 'month' ? 'open-date' : null)}
              />
            </Stack>
            {isMobile ? null : <div className="vr ms-4 me-5" style={{ width: 2 }} />}
          </Stack>
        </div>
        <div className="col-12 col-lg-8 mb-3">
          {isAdmin() ? <AdminPanel /> : <MemberPanel />}
        </div>
      </>
    );
};

export default Calendar;
