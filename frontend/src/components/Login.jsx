import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm.jsx';
import routes from './routes.js';

const Login = () => {
  const { t } = useTranslation();
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img className="rounded-circle" src="./avatar.jpg" alt={t('to_come')} />
              </div>
              <LoginForm />
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('not_account')}</span>
                <Link to={routes.signupPage}>{t('signup.title')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
