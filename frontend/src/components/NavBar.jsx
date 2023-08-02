// import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { AuthContext } from './Context.jsx';
import routes from '../routes.js';

const NavBar = () => {
//  const { t } = useTranslation();
  const { logOut } = useContext(AuthContext);
  const isAuth = useSelector((state) => state.calendar.entities.length > 0);
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href={routes.homePage}>Календарь записи</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {isAuth && (
            <Button
              variant="primary"
              onClick={() => {
                logOut();
              }}
            >
              Выйти
            </Button>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
