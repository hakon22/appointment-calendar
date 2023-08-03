import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { AuthContext } from './Context.jsx';
import routes from '../routes.js';

const NavBar = ({ isAuth }) => {
  const { t } = useTranslation();
  const { logOut } = useContext(AuthContext);
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href={routes.homePage}>{t('navBar.title')}</Navbar.Brand>
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
              {t('navBar.exit')}
            </Button>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
