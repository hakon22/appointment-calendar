import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CalendarApp from 'react-calendar';
import { useTranslation } from 'react-i18next';
import { Alert, Stack } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { MobileContext } from '../components/Context.jsx';
import AdminPanel from '../components/AdminPanel.jsx';
import MemberPanel from '../components/MemberPanel.jsx';
import { updateTokens } from '../slices/loginSlice.js';
import { fetchDate } from '../slices/calendarSlice.js';

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
        <Helmet>
          <title>{t('calendar.title')}</title>
          <meta name="description" content={t('calendar.description')} />
          <link rel="canonical" href={window.location.href} />
        </Helmet>
        <Stack direction="horizontal">
          <Stack>
            <Alert variant="primary" className="text-center">
              {isAdmin() ? t('calendar.adminAlert') : t('calendar.alert')}
            </Alert>
            <CalendarApp
              className="w-100"
              value={date}
              onClickDay={(value) => setDate(value)}
              onChange={() => dispatch(fetchDate)}
              tileClassName={({ view }) => (view === 'month' ? 'open-date' : null)}
            />
          </Stack>
          {isMobile ? null : <div className="vr ms-4 me-5" style={{ width: 2 }} />}
        </Stack>
      </div>
      <div className="col-12 col-md-8 mb-3">
        {isAdmin() ? <AdminPanel date={date} /> : <MemberPanel date={date} />}
      </div>
    </>
  );
};

export default Calendar;
