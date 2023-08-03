import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CalendarApp from 'react-calendar';
// import cn from 'classnames';
import {
  Button, Card, Tabs, Tab, Alert, Stack, Spinner,
} from 'react-bootstrap';
import { MobileContext } from '../components/Context.jsx';
import { fetchLoading, selectors } from '../slices/calendarSlice.js';

const Calendar = () => {
  const dispatch = useDispatch();
  const isMobile = useContext(MobileContext);
  const [date, setDate] = useState(undefined);
  const [nav, setNav] = useState('recording');

  const { loadingStatus } = useSelector((state) => state.calendar);
  const { token } = useSelector((state) => state.login);
  const data = useSelector(selectors.selectAll);

  useEffect(() => {
    dispatch(fetchLoading(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (date) {
      setNav('confirmation');
      dispatch(fetchLoading(date));
    }
  }, [date, dispatch]);

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
                Выберите удобный день для записи
              </Alert>
              <CalendarApp className="w-100" onChange={() => setDate(new Date())} value={date} />
            </Stack>
            {isMobile ? null : <div className="vr ms-4 me-5" />}
          </Stack>
        </div>
        <div className="col-12 col-lg-8 mb-3">
          <Card bg="light">
            <Card.Header>
              <Tabs
                activeKey={nav}
                onSelect={(key) => setNav(key)}
                id="tabs"
              >
                <Tab eventKey="recording" title="Запись" disabled={date}>
                  <hr />
                  <Card.Body>
                    <Card.Title>Запишитесь на сеанс!</Card.Title>
                    <Card.Text>
                      Вы можете сделать это, щёлкнув по желаемой дате календаря слева.
                    </Card.Text>
                  </Card.Body>
                </Tab>
                <Tab eventKey="confirmation" title="Подтверждение" disabled={!date}>
                  <hr />
                  <Card.Body>
                    <Card.Title>Выберите подходящее время:</Card.Title>
                    <Card.Text>
                      {data.map((time) => time)}
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                  </Card.Body>
                </Tab>
              </Tabs>
            </Card.Header>
          </Card>
        </div>
      </>
    );
};

export default Calendar;
