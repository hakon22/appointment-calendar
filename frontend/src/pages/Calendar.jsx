import { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CalendarApp from 'react-calendar';
import { useTranslation } from 'react-i18next';
import { Alert, Stack } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { MobileContext } from '../components/Context.jsx';
import AdminPanel from '../components/AdminPanel.jsx';
import MemberPanel from '../components/MemberPanel.jsx';
import { ModalTimesHandler } from '../components/Modals.jsx';
import { updateTokens } from '../slices/loginSlice.js';
import { fetchDate } from '../slices/calendarSlice.js';

const Calendar = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isMobile = useContext(MobileContext);
  const [date, setDate] = useState('');
  const [currentStringDate, setCurrentStringDate] = useState('');

  const { refreshToken, role, token } = useSelector((state) => state.login);
  const { currentDate } = useSelector((state) => state.calendar);

  const [show, setShow] = useState([false, { time: '', act: '', user: '' }]);
  const modalClose = (time, act) => setShow([false, { time, act, user: '' }]);
  const modalShow = ({ time, act = '', user = '' }) => setShow([true, { time, act, user }]);

  useEffect(() => {
    if (refreshToken !== null) {
      const fetch = () => dispatch(updateTokens(refreshToken));

      const timeAlive = setTimeout(fetch, 595000);
      return () => clearTimeout(timeAlive);
    }
    return undefined;
  }, [dispatch, refreshToken]);

  const isAdmin = () => role === 'admin';
  const locale = i18n.language === 'ru' ? 'ru-RU' : 'en-EN';

  useEffect(() => {
    if (date) {
      setCurrentStringDate(date.toLocaleString(locale, { year: 'numeric', month: 'long', day: 'numeric' }).slice(0, locale === 'ru-RU' ? -1 : 99));
    }
  }, [date, locale]);

  return (
    <>
      <div className="col-12 col-md-4 mb-3">
        <Helmet>
          <title>{t('calendar.title')}</title>
          <meta name="description" content={t('calendar.description')} />
          <link rel="canonical" href={window.location.href} />
        </Helmet>
        <ModalTimesHandler
          date={currentDate}
          obj={show[1]}
          show={show[0]}
          onHide={modalClose}
        />
        <Stack direction="horizontal">
          <Stack>
            <Alert variant="primary" className="text-center">
              {isAdmin() ? t('calendar.adminAlert') : t('calendar.alert')}
            </Alert>
            <CalendarApp
              className="w-100"
              value={date}
              onClickDay={(value) => {
                setDate(value);
                dispatch(fetchDate({ token, date: value.toLocaleDateString('ru-RU') }));
              }}
              minDate={!isAdmin() && new Date()}
              locale={locale}
            />
          </Stack>
          {isMobile ? null : <div className="vr ms-4 me-5" style={{ width: 2 }} />}
        </Stack>
      </div>
      <div className="col-12 col-md-8 mb-3">
        {isAdmin()
          ? <AdminPanel date={currentDate} stringDate={currentStringDate} modalShow={modalShow} />
          : <MemberPanel date={currentDate} stringDate={currentStringDate} modalShow={modalShow} />}
      </div>
    </>
  );
};

export default Calendar;
