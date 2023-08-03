import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchLogin } from '../slices/loginSlice.js';
import { AuthContext, MobileContext } from './Context.jsx';
import { loginValidation } from '../validations/validations.js';
import routes from '../routes.js';

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loggedIn, logIn } = useContext(AuthContext);
  const isMobile = useContext(MobileContext);
  const notify = (text, type) => toast[type](text);

  useEffect(() => {
    if (loggedIn) {
      navigate(routes.homePage);
    }
  }, [loggedIn, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const {
          payload: {
            token, message, code,
          },
        } = await dispatch(fetchLogin(values));
        if (token) {
          logIn();
        } else if (code === 1) {
          setSubmitting(false);
          setFieldError('email', message);
        } else if (code === 2) {
          setSubmitting(false);
          setFieldError('password', message);
        } else if (!code) {
          notify(t('toast.networkError'), 'error');
        }
      } catch (e) {
        console.log(e);
        notify(t('toast.unknownError'), 'error');
      }
    },
  });

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className={cn(('mx-auto'), {
        'w-50': !isMobile,
      })}
    >
      <Form.Group
        className={cn('form-floating', {
          'mb-3': !formik.errors.email,
          'mb-5': formik.errors.email && formik.touched.email,
        })}
        controlId="email"
      >
        <FloatingLabel label={t('loginForm.email')} controlId="email">
          <Form.Control
            autoFocus
            type="email"
            className="mb-2"
            onChange={formik.handleChange}
            value={formik.values.email}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.email && formik.touched.email}
            onBlur={formik.handleBlur}
            name="email"
            placeholder={t('loginForm.email')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right">
            {t(formik.errors.email)}
          </Form.Control.Feedback>
        </FloatingLabel>
      </Form.Group>
      <Form.Group
        className={cn('form-floating', {
          'mb-3': !formik.errors.password,
          'mb-5': formik.errors.password && formik.touched.password,
        })}
        controlId="password"
      >
        <FloatingLabel label={t('loginForm.password')} controlId="password">
          <Form.Control
            className="mb-2"
            onChange={formik.handleChange}
            value={formik.values.password}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.password && formik.touched.password}
            onBlur={formik.handleBlur}
            name="password"
            type="password"
            placeholder={t('loginForm.password')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right">
            {t(formik.errors.password)}
          </Form.Control.Feedback>
        </FloatingLabel>
      </Form.Group>
      <Button variant="outline-primary" className="w-100" type="submit">{t('loginForm.submit')}</Button>
    </Form>
  );
};

export default LoginForm;
