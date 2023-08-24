/* eslint-disable react-hooks/exhaustive-deps */
import {
  useContext, useState, useEffect, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Button, Card, Tabs, Tab, Spinner,
} from 'react-bootstrap';
import { MobileContext } from './Context.jsx';
import ConfirmRecord from './ConfirmRecord.jsx';

const MemberPanel = ({ date, stringDate }) => {
//  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMobile = useContext(MobileContext);
  const [status, setStatus] = useState(['home', null]);
  const scrollRef = useRef();

  const { username } = useSelector((state) => state.login);
  const { time, loadingStatus } = useSelector((state) => state.calendar);

  useEffect(() => {
    if (date && (status[0] === 'home' || status[0] === 'setup' || status[0] === 'confirmation')) {
      setStatus(['recording', null]);
    }
    if (date && time) {
      scrollRef.current.scrollIntoView();
    }
  }, [date]);

  return (
    <Card bg="light">
      <Card.Header ref={scrollRef}>
        <Tabs
          activeKey={status[0]}
          onSelect={(key) => setStatus([key, null])}
          id="tabs"
          className="fs-sm-6"
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
          <Tab eventKey="recording" title={t('calendar.tabs.recording')} disabled={!date}>
            <hr />
            <Card.Body>
              <Card.Title className="mb-4">{time ? t('calendar.recordingTitle', { date: stringDate }) : t('calendar.monitoringCloseDay')}</Card.Title>
              <Card.Text as="div">
                {loadingStatus !== 'finish' && loadingStatus !== 'idle'
                  ? (
                    <div className="h-100 d-flex justify-content-start align-items-center">
                      <Spinner animation="border" variant="primary" role="status" />
                    </div>
                  )
                  : time
                    && (
                      <div className="time-buttons-group gap-3 mb-5">
                        {Object.entries(time).map(([key, { user }]) => (
                          <Button
                            key={key}
                            variant="outline-primary"
                            onClick={() => {
                              if (!user) {
                                setStatus(['confirmation', key]);
                              }
                            }}
                            size="sm"
                            disabled={user}
                          >
                            {key}
                          </Button>
                        ))}
                      </div>
                    )}
              </Card.Text>
            </Card.Body>
          </Tab>
          <Tab eventKey="confirmation" title={t('calendar.tabs.confirmation')} disabled>
            <hr />
            <Card.Body>
              <Card.Title className="mb-4">{t('calendar.confirmationTitle', { date: stringDate })}</Card.Title>
              <Card.Text as="div">
                {status[1]
                  && <ConfirmRecord date={date} stringDate={stringDate} time={status[1]} />}
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
