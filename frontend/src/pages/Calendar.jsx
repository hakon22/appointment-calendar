import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CalendarApp from 'react-calendar';
import { useTranslation } from 'react-i18next';
import { Alert, Stack } from 'react-bootstrap';
import { MobileContext } from '../components/Context.jsx';
import AdminPanel from '../components/AdminPanel.jsx';
import MemberPanel from '../components/MemberPanel.jsx';
import { updateTokens } from '../slices/loginSlice.js';

const Calendar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isMobile = useContext(MobileContext);
  const [date, setDate] = useState('');

  const { refreshToken, role } = useSelector((state) => state.login);

  useEffect(() => {
    if (refreshToken !== null) {
      const fetch = () => dispatch(updateTokens(refreshToken));

      const timeAlive = setTimeout(fetch, 595000);
      return () => clearTimeout(timeAlive);
    }
    return undefined;
  }, [dispatch, refreshToken]);

  const isAdmin = () => role === 'admin';

  return (
    <>
      <div className="col-12 col-md-4 mb-3">
        <Stack direction="horizontal">
          <Stack>
            <Alert variant="primary" className="text-center">
              {isAdmin() ? t('calendar.adminAlert') : t('calendar.alert')}
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
      <div className="col-12 col-md-8 mb-3">
        {isAdmin() ? <AdminPanel /> : <MemberPanel />}
      </div>
    </>
  );
};

export default Calendar;
