import { useState } from 'react';
import CalendarApp from 'react-calendar';
// import cn from 'classnames';
import {
  Button, Card, Tabs, Alert, Stack,
} from 'react-bootstrap';

const Calendar = ({ isMobile }) => {
  const [date, setDate] = useState('');
  const [nav, setNav] = useState('home');

  const calendarDate = () => {
    setDate(new Date());
  };
  return (
    <>
      <div className="col-12 col-lg-4 mb-3">
        <Stack direction="horizontal">
          <Stack>
            <Alert variant="primary" className="text-center">
              Выберите удобный день для записи
            </Alert>
            <CalendarApp className="w-100" onChange={calendarDate} value={date} />
          </Stack>
          {isMobile ? null : <div className="vr ms-4 me-5" />}
        </Stack>
      </div>
      <div className="col-12 col-lg-8 mb-3">
        <Card bg="light">
          <Card.Header>
            <Tabs
              defaultActiveKey={nav}
              onSelect={(key) => setNav(key)}
              transition={false}
              id="tabs"
            >
              <Tabs.Tab eventKey="home" title="Главная">
                <hr />
                <Card.Body>
                  <Card.Title>Запишитесь на сеанс!</Card.Title>
                  <Card.Text>
                    Вы можете сделать это, щёлкнув по желаемой дате календаря слева.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Tabs.Tab>
              <Tabs.Tab eventKey="profile" title="Запись" disabled>
                <hr />
                <Card.Body>
                  <Card.Title>2Special title treatment</Card.Title>
                  <Card.Text>
                    With supporting text below as a natural lead-in to additional content.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Tabs.Tab>
              <Tabs.Tab eventKey="contact" title="Подтверждение" disabled>
                <hr />
                <Card.Body>
                  <Card.Title>Special title treatment</Card.Title>
                  <Card.Text>
                    With supporting text below as a natural lead-in to additional content.
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Tabs.Tab>
            </Tabs>
          </Card.Header>
        </Card>
      </div>
    </>
  );
};

export default Calendar;
