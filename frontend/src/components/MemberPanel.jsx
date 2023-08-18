import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Button, Card, Tabs, Tab,
} from 'react-bootstrap';
import { MobileContext } from './Context.jsx';
// import { fetchLoading } from '../slices/calendarSlice.js';

const MemberPanel = () => {
//  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMobile = useContext(MobileContext);
  const [nav, setNav] = useState('home');
  const { username } = useSelector((state) => state.login);

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
                {isMobile ? t('calendar.homeTextMobile') : t('calendar.homeText')}
              </Card.Text>
            </Card.Body>
          </Tab>
          <Tab eventKey="recording" title={t('calendar.tabs.recording')}>
            <hr />
            <Card.Body>
              <Card.Title>{t('calendar.recordingTitle')}</Card.Title>
              <Card.Text>
                {isMobile ? t('calendar.recordingTextMobile') : t('calendar.recordingText')}
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
              <Card.Title>{t('calendar.setupTitle')}</Card.Title>
              <Card.Text>
                {t('calendar.setupText')}
              </Card.Text>
              <Button variant="primary">Какая-нибудь кнопка</Button>
            </Card.Body>
          </Tab>
        </Tabs>
      </Card.Header>
    </Card>
  );
};

export default MemberPanel;
