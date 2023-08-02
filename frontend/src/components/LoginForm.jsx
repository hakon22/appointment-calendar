import { Formik, Form, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useEffect, useContext, useState } from 'react';
import * as Yup from 'yup';
import cn from 'classnames';
import { fetchToken } from '../slices/loginSlice.js';
import { AuthContext } from './Context.jsx';

const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loggedIn, logIn } = useContext(AuthContext);
  const [storeErrors, setErrors] = useState(null);

  const SignupSchema = Yup.object().shape({
    username: Yup.string().required(t('validation.required')),
    password: Yup.string().required(t('validation.required')),
  });

  useEffect(() => {
    if (loggedIn) {
      window.location.replace('/');
    }
  }, [loggedIn, storeErrors]);
  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values) => {
        const { meta: { requestStatus } } = await dispatch(fetchToken(values));
        if (requestStatus === 'fulfilled') {
          logIn();
        } else {
          setErrors(t('validation.loginFailed'));
        }
      }}
    >
      {({ errors }) => {
        const styleInput = cn('form-control', {
          'is-invalid': storeErrors,
        });
        return (
          <Form className="col-12 col-md-6 mt-3 mt-mb-0">
            <h1 className="text-center mb-4">{t('to_come')}</h1>
            <div className="form-floating mb-3">
              <Field id="username" autoFocus name="username" className={styleInput} placeholder={t('you_nick')} required />
              <label htmlFor="username">{t('you_nick')}</label>
              {errors.username && <div className="invalid-tooltip">{errors.username}</div>}
            </div>
            <div className="form-floating mb-4">
              <Field name="password" id="password" type="password" className={styleInput} placeholder={t('you_pass')} required />
              <label htmlFor="password">{t('you_pass')}</label>
              {storeErrors && !errors.password && <div className="invalid-tooltip">{storeErrors}</div>}
              {errors.password && <div className="invalid-tooltip">{errors.password}</div>}
            </div>
            <button className="w-100 mb-3 btn btn-outline-primary" type="submit">{t('to_come')}</button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
