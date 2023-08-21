/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import {
  Button, Card, Tabs, Tab, Spinner,
} from 'react-bootstrap';
import { MobileContext } from './Context.jsx';
import NewDate from './NewDate.jsx';
import { fetchDate } from '../slices/calendarSlice.js';

const AdminPanel = ({ date }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMobile = useContext(MobileContext);
  const [nav, setNav] = useState('home');
  const { username, token } = useSelector((state) => state.login);
  const { ids, entities, loadingStatus } = useSelector((state) => state.calendar);

  const formik = useFormik({
    initialValues: {
      date: '',
    },
    onSubmit: async (values) => {
      try {
        dispatch(fetchDate({ token, date: values.date }));
      } catch (e) {
        console.log(e);
      }
    },
  });

  useEffect(() => {
    if (date && (nav === 'home' || nav === 'setup')) {
      setNav('monitoring');
    }
    if (date) {
      formik.setFieldValue('date', date.toLocaleDateString('en-CA'));
    }
  }, [date]);

  return (
    <Card bg="light">
      <Card.Header>
        <Tabs
          activeKey={nav}
          onSelect={(key) => setNav(key)}
          id="tabs"
        >
          <Tab eventKey="home" title={t('calendar.tabs.home')}>
            <hr />
            <Card.Body>
              <Card.Title>{t('calendar.homeTitle', { username })}</Card.Title>
              <Card.Text>
                {isMobile ? t('calendar.adminHomeTextMobile') : t('calendar.adminHomeText')}
              </Card.Text>
            </Card.Body>
          </Tab>
          <Tab eventKey="monitoring" title={t('calendar.tabs.monitoring')} disabled={!date}>
            <hr />
            <Card.Body>
              <Card.Title>{t('calendar.monitoringTitle', { date: date.toLocaleString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }).slice(0, -1) })}</Card.Title>
              <Card.Text>
                {isMobile ? t('calendar.adminMonitoringTextMobile') : t('calendar.adminMonitoringText')}
              </Card.Text>
            </Card.Body>
          </Tab>
          <Tab eventKey="control" title={t('calendar.tabs.control')}>
            <hr />
            <Card.Body>
              <Card.Title className="mb-4 fs-6">{t('calendar.controlTitle')}</Card.Title>
              <Card.Text as="div">
                {loadingStatus !== 'finish' && loadingStatus !== 'idle'
                  ? (
                    <div className="h-100 d-flex justify-content-start align-items-center">
                      <Spinner animation="border" variant="primary" role="status" />
                    </div>
                  )
                  : ids.length > 0 && date
                    ? (
                      <>
                        <p>{t('calendar.monitoringTitle', { date: date.toLocaleString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }).slice(0, -1) })}</p>
                        <div>{entities.map((time) => time)}</div>
                      </>
                    )
                    : date ? <NewDate date={formik.values.date} /> : t('calendar.controlText')}
              </Card.Text>
            </Card.Body>
          </Tab>
          <Tab eventKey="confirmation" title={t('calendar.tabs.confirmation')} disabled>
            <hr />
            <Card.Body>
              <Card.Title>{t('calendar.confirmationTitle')}</Card.Title>
              <Card.Text>
                {isMobile ? t('calendar.confirmationTextMobile') : t('calendar.confirmationText')}
              </Card.Text>
            </Card.Body>
          </Tab>
          <Tab eventKey="setup" title={t('calendar.tabs.setup')}>
            <hr />
            <Card.Body>
              <Card.Title>{t('calendar.adminSetupTitle')}</Card.Title>
              <Card.Text>
                {t('calendar.adminSetupText')}
              </Card.Text>
              <Button variant="primary">Какая-нибудь кнопка</Button>
            </Card.Body>
          </Tab>
        </Tabs>
      </Card.Header>
    </Card>
  );
};

export default AdminPanel;
