import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import routes from '../routes.js';
import RecoveryForm from '../components/RecoveryForm.jsx';

const Recovery = () => {
  const { t } = useTranslation();

  return (
    <div className="col-12 col-lg-8">
      <Helmet>
        <title>{t('recoveryForm.title')}</title>
        <meta name="description" content={t('recoveryForm.description')} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Card border="secondary" bg="light" className="text-center">
        <Card.Header className="h4">{t('recoveryForm.title')}</Card.Header>
        <Card.Body>
          <RecoveryForm />
        </Card.Body>
        <Card.Footer>
          <span>{t('recoveryForm.rememberPassword')}</span>
          <Link to={routes.loginPage}>{t('loginForm.submit')}</Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Recovery;
