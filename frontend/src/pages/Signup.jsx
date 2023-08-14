import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from '../routes.js';
import SignupForm from '../components/SignupForm.jsx';

const Signup = () => {
  const { t } = useTranslation();
  return (
    <div className="col-12 col-lg-8">
      <Card border="secondary" bg="light" className="text-center">
        <Card.Header className="h4">{t('signupForm.title')}</Card.Header>
        <Card.Body>
          <SignupForm />
        </Card.Body>
        <Card.Footer>
          <span>{t('signupForm.haveAccount')}</span>
          <Link to={routes.loginPage}>{t('loginForm.submit')}</Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Signup;
