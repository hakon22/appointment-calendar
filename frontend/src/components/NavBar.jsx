import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import { AuthContext } from './Context.jsx';
import { removeToken } from '../slices/loginSlice.js';
import routes from '../routes.js';

const NavBar = ({ loggedIn }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { logOut } = useContext(AuthContext);
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Link className="navbar-brand" to={routes.homePage}>{t('navBar.title')}</Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {loggedIn && (
            <Button
              variant="primary"
              onClick={() => {
                logOut();
                dispatch(removeToken());
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
