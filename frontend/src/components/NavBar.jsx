import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar, Container, Button, ButtonGroup, ToggleButton,
} from 'react-bootstrap';
import languages from '../locales/index.js';
import { upperCase } from '../utilities/textTransform.js';
import { AuthContext } from './Context.jsx';
import routes from '../routes.js';

const NavBar = ({ loggedIn }) => {
  const { t, i18n } = useTranslation();
  const { logOut } = useContext(AuthContext);
  return (
    <Navbar bg="white">
      <Container>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-start">
          <Navbar.Text>
            <Link className="navbar-brand" to={routes.homePage}>{t('navBar.title')}</Link>
          </Navbar.Text>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-center">
          <Navbar.Text>
            <ButtonGroup>
              {Object.keys(languages).map((lang) => (
                <ToggleButton
                  key={lang}
                  id={lang}
                  type="radio"
                  variant="outline-success"
                  name="radio"
                  value={lang}
                  size="sm"
                  checked={i18n.language === lang}
                  onChange={({ target }) => i18n.changeLanguage(target.value)}
                >
                  {upperCase(lang)}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Navbar.Text>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {loggedIn && (
            <Button
              variant="primary"
              onClick={logOut}
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
