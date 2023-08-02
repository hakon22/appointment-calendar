import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from './routes.js';
import SignupForm from '../components/SignupForm.jsx';

const Signup = () => {
  const { t } = useTranslation();
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img className="rounded-circle" src="./avatar_1.jpg" alt={t('registr')} />
              </div>
              <SignupForm />
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('have_account')}</span>
                <Link to={routes.loginPage}>{t('to_come')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
