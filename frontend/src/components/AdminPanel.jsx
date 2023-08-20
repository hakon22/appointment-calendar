/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import {
  Button, Card, Tabs, Tab, Form,
} from 'react-bootstrap';
import { MobileContext } from './Context.jsx';
import { fetchDate } from '../slices/calendarSlice.js';

const AdminPanel = ({ date }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMobile = useContext(MobileContext);
  const [nav, setNav] = useState('home');
  const { username, token } = useSelector((state) => state.login);

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
                {date
                  ? (
                    <Form
                      onSubmit={formik.handleSubmit}
                      className="col-8 col-md-5 col-lg-4 col-xxl-3"
                    >
                      <Form.Control
                        className="mb-3"
                        type="date"
                        name="date"
                        onChange={formik.handleChange}
                        value={formik.values.date}
                        disabled={formik.isSubmitting}
                        onBlur={formik.handleBlur}
                        required
                      />
                      <Button variant="primary" type="submit" disabled={formik.isSubmitting}>{t('loginForm.submit')}</Button>
                    </Form>
                  )
                  : t('calendar.controlText')}
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
