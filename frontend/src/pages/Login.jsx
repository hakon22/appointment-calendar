import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from '../routes.js';
import LoginForm from '../components/LoginForm.jsx';

const Login = () => {
  const { t } = useTranslation();
  return (
    <div className="col-12 col-lg-8">
      <Card border="secondary" bg="light" className="text-center">
        <Card.Header className="h4">{t('loginForm.title')}</Card.Header>
        <Card.Body>
          <LoginForm />
        </Card.Body>
        <Card.Footer>
          <span>{t('notAccount')}</span>
          <Link to={routes.signupPage}>{t('signupForm.title')}</Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Login;
