import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import routes from '../routes.js';
import SignupForm from '../components/SignupForm.jsx';

const Signup = () => {
  const { t } = useTranslation();
  return (
    <div className="col-12 col-lg-8">
      <Helmet>
        <title>{t('signupForm.title')}</title>
        <meta name="description" content={t('signupForm.description')} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
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
