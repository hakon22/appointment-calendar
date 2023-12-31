/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  useContext, useState, useEffect, useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Button, Card, Tabs, Tab, Spinner, Badge, DropdownButton, ButtonGroup, Dropdown,
} from 'react-bootstrap';
import { Bucket } from 'react-bootstrap-icons';
import cn from 'classnames';
import { MobileContext } from './Context.jsx';
import NewDate from './NewDate.jsx';
import ChangeData from './ChangeData.jsx';
import { fetchDate } from '../slices/calendarSlice.js';

const AdminPanel = ({ date, stringDate, modalShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isMobile = useContext(MobileContext);
  const [nav, setNav] = useState('home');
  const scrollRef = useRef();

  const { username, token } = useSelector((state) => state.login);
  const { time, loadingStatus } = useSelector((state) => state.calendar);
  const timeValues = time || {};

  useEffect(() => {
    if (date && (nav === 'home' || nav === 'setup')) {
      setNav('monitoring');
    }
    if (date && time) {
      scrollRef.current.scrollIntoView();
    }
  }, [date]);

  useEffect(() => {
    if (Object.values(timeValues).includes(true)) {
      dispatch(fetchDate({ token, date }));
    }
  }, [timeValues]);

  return (
    <Card bg="light">
      <Card.Header ref={scrollRef}>
        <Tabs
          activeKey={nav}
          onSelect={(key) => setNav(key)}
          id="tabs"
          className="fs-sm-6"
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
              <Card.Title className="mb-4">{t('calendar.monitoringTitle', { date: stringDate })}</Card.Title>
              <Card.Text as="div">
                {loadingStatus !== 'finish' && loadingStatus !== 'idle'
                  ? (
                    <div className="h-100 d-flex justify-content-start align-items-center">
                      <Spinner animation="border" variant="primary" role="status" />
                    </div>
                  )
                  : time
                    ? (
                      <div className="d-flex flex-column gap-2">
                        {Object.values(time).find((value) => value)
                          ? Object.entries(time).map(([key, value]) => {
                            if (value.user) {
                              const { user } = value;
                              return (
                                <div key={key} className="d-flex flex-wrap gap-1 justify-content-between align-items-center">
                                  <Badge
                                    bg="success"
                                    className={cn('fs-6', {
                                      'col-10 d-flex justify-content-center align-items-center': isMobile,
                                    })}
                                  >
                                    {key}
                                  </Badge>
                                  {isMobile && (
                                  <Bucket
                                    role="button"
                                    className="fs-4 remove-button ms-2"
                                    onClick={() => modalShow({ time: [key, stringDate], act: 'removeRecord' })}
                                    title={t('modal.submitRemove')}
                                  />
                                  )}
                                  <span className={cn({
                                    'col-12': isMobile,
                                  })}
                                  >
                                    {user.username}
                                  </span>
                                  <span className={cn({
                                    'col-12': isMobile,
                                  })}
                                  >
                                    {user.phone}
                                  </span>
                                  <span className={cn({
                                    'col-12 mb-2': isMobile,
                                  })}
                                  >
                                    {user.email}
                                  </span>
                                  {!isMobile && (
                                  <Bucket
                                    role="button"
                                    className="fs-4 remove-button"
                                    onClick={() => modalShow({ time: [key, stringDate], act: 'removeRecord' })}
                                    title={t('modal.submitRemove')}
                                  />
                                  )}
                                </div>
                              );
                            }
                          }) : t('calendar.monitoringText')}
                        <div>
                          <Button className="mt-3" variant="danger" size="sm" onClick={() => modalShow({ time: stringDate, act: 'removeDate' })}>{t('calendar.closeDate')}</Button>
                        </div>
                      </div>
                    )
                    : t('calendar.monitoringCloseDay')}
              </Card.Text>
            </Card.Body>
          </Tab>
          <Tab eventKey="control" title={t('calendar.tabs.control')}>
            <hr />
            <Card.Body>
              <Card.Title className="mb-4">{date ? t('calendar.controlTextOpenTime', { date: stringDate }) : t('calendar.controlTitle')}</Card.Title>
              <Card.Text as="div">
                {loadingStatus !== 'finish' && loadingStatus !== 'idle'
                  ? (
                    <div className="h-100 d-flex justify-content-start align-items-center">
                      <Spinner animation="border" variant="primary" role="status" />
                    </div>
                  )
                  : time
                    ? (
                      <>
                        <div className="time-buttons-group gap-3 mb-5">
                          {Object.entries(time).map(([key, value]) => {
                            if (value.user) {
                              return (
                                <DropdownButton
                                  key={key}
                                  as={ButtonGroup}
                                  size="sm"
                                  variant="warning"
                                  title={key}
                                >
                                  <Dropdown.Item eventKey="1" onClick={() => modalShow({ time: [key, stringDate], act: 'removeRecord' })}>{t('calendar.dropMenuСancel')}</Dropdown.Item>
                                </DropdownButton>
                              );
                            }
                            return (
                              <DropdownButton
                                key={key}
                                as={ButtonGroup}
                                size="sm"
                                variant="outline-primary"
                                title={key}
                              >
                                <Dropdown.Item eventKey="1" onClick={() => modalShow({ time: key })}>{t('calendar.dropMenuChange')}</Dropdown.Item>
                                <Dropdown.Item eventKey="2" onClick={() => modalShow({ time: [key, stringDate], act: 'remove' })}>{t('calendar.dropMenuRemove')}</Dropdown.Item>
                              </DropdownButton>
                            );
                          })}
                        </div>
                        <NewDate date={date} time={time} />
                        <Button variant="danger" size="sm" onClick={() => modalShow({ time: stringDate, act: 'removeDate' })}>{t('calendar.closeDate')}</Button>
                      </>
                    )
                    : date ? <NewDate date={date} /> : t('calendar.controlText')}
              </Card.Text>
            </Card.Body>
          </Tab>
          <Tab eventKey="setup" title={t('calendar.tabs.setup')}>
            <hr />
            <Card.Body>
              <Card.Title className="mb-4">{t('calendar.setupTitle')}</Card.Title>
              <Card.Text as="div">
                <ChangeData />
              </Card.Text>
            </Card.Body>
          </Tab>
        </Tabs>
      </Card.Header>
    </Card>
  );
};

export default AdminPanel;
