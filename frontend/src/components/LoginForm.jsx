import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { fetchLogin } from '../slices/loginSlice.js';
import { AuthContext, MobileContext } from './Context.jsx';
import { loginValidation } from '../validations/validations.js';

const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { logIn } = useContext(AuthContext);
  const isMobile = useContext(MobileContext);
  const notify = (text, type) => toast[type](text);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      save: false,
    },
    validationSchema: loginValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const {
          payload: {
            token, refreshToken, message, code,
          },
        } = await dispatch(fetchLogin(values));
        if (token) {
          if (values.save) {
            window.localStorage.setItem('refresh_token', refreshToken);
          }
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

  const formClass = (field) => cn('form-floating', {
    'mb-3': !formik.errors[field],
    'mb-3-5': formik.errors[field] && formik.touched[field],
  });

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className={cn(('mx-auto'), {
        'w-50': !isMobile,
      })}
    >
      <Form.Group
        className={formClass('email')}
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
        className={formClass('password')}
        controlId="password"
      >
        <FloatingLabel label={t('loginForm.password')} controlId="password">
          <Form.Control
            className="mb-3"
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
      <Form.Check
        className="mb-2 text-start"
        onChange={formik.handleChange}
        disabled={formik.isSubmitting}
        onBlur={formik.handleBlur}
        type="checkbox"
        id="save"
        name="save"
        label={t('loginForm.checkbox')}
      />
      <Button variant="outline-primary" className="w-100" type="submit">{t('loginForm.submit')}</Button>
    </Form>
  );
};

export default LoginForm;
