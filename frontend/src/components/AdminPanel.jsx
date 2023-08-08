import { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Button, Card, Tabs, Tab,
} from 'react-bootstrap';
import { MobileContext } from './Context.jsx';
import { fetchToken } from '../slices/loginSlice.js';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMobile = useContext(MobileContext);
  const [nav, setNav] = useState('monitoring');
  const { username, token } = useSelector((state) => state.login);

  return (
    <Card bg="light">
      <Card.Header>
        <Tabs
          activeKey={nav}
          onSelect={(key) => setNav(key)}
          id="tabs"
        >
          <Tab eventKey="home" title={t('calendar.home')}>
            <hr />
            <Card.Body>
              <Card.Title>{t('calendar.homeTitle', { username })}</Card.Title>
              <Card.Text>
                {isMobile ? t('calendar.adminHomeTextMobile') : t('calendar.adminHomeText')}
              </Card.Text>
            </Card.Body>
          </Tab>
          <Tab eventKey="monitoring" title={t('calendar.monitoring')}>
            <hr />
            <Card.Body>
              <Card.Title>{t('calendar.monitoringTitle')}</Card.Title>
              <Card.Text>
                {isMobile ? t('calendar.adminMonitoringTextMobile') : t('calendar.adminMonitoringText')}
              </Card.Text>
            </Card.Body>
          </Tab>
          <Tab eventKey="confirmation" title={t('calendar.confirmation')} disabled>
            <hr />
            <Card.Body>
              <Card.Title>{t('calendar.confirmationTitle')}</Card.Title>
              <Card.Text>
                {isMobile ? t('calendar.confirmationTextMobile') : t('calendar.confirmationText')}
              </Card.Text>
            </Card.Body>
          </Tab>
          <Tab eventKey="setup" title={t('calendar.adminSetup')}>
            <hr />
            <Card.Body>
              <Card.Title>{t('calendar.adminSetupTitle')}</Card.Title>
              <Card.Text>
                {t('calendar.adminSetupText')}
              </Card.Text>
              <Button variant="primary" onClick={() => dispatch(fetchToken(token))}>Какая-нибудь кнопка</Button>
            </Card.Body>
          </Tab>
        </Tabs>
      </Card.Header>
    </Card>
  );
};

export default AdminPanel;
