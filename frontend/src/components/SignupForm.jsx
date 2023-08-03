import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useEffect, useContext } from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import cn from 'classnames';
import axios from 'axios';
import { fetchLogin } from '../slices/loginSlice.js';
import { AuthContext, MobileContext } from './Context.jsx';
import { signupValidation } from '../validations/validations.js';
import routes from '../routes.js';

const SignupForm = () => {
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
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signupValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const { data: { message, code } } = await axios.post(routes.signup, values);
        if (code === 5) {
          const { email, password } = values;
          const { payload: { token } } = await dispatch(fetchLogin({ email, password }));
          if (token) {
            logIn();
          } else {
            notify(t('toast.networkError'), 'error');
          }
        } else {
          setSubmitting(false);
          setFieldError('email', message);
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
          'mb-3': !formik.errors.username,
          'mb-5': formik.errors.username && formik.touched.username,
        })}
        controlId="username"
      >
        <FloatingLabel label={t('signupForm.username')} controlId="username">
          <Form.Control
            autoFocus
            type="text"
            className="mb-2"
            onChange={formik.handleChange}
            value={formik.values.username}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.username && formik.touched.username}
            onBlur={formik.handleBlur}
            name="username"
            placeholder={t('signupForm.username')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right">
            {t(formik.errors.username)}
          </Form.Control.Feedback>
        </FloatingLabel>
      </Form.Group>
      <Form.Group
        className={cn('form-floating', {
          'mb-3': !formik.errors.email,
          'mb-5': formik.errors.email && formik.touched.email,
        })}
        controlId="email"
      >
        <FloatingLabel label={t('signupForm.email')} controlId="email">
          <Form.Control
            type="email"
            className="mb-2"
            onChange={formik.handleChange}
            value={formik.values.email}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.email && formik.touched.email}
            onBlur={formik.handleBlur}
            name="email"
            placeholder={t('signupForm.email')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right">
            {t(formik.errors.email)}
          </Form.Control.Feedback>
        </FloatingLabel>
      </Form.Group>
      <Form.Group
        className={cn('form-floating', {
          'mb-3': !formik.errors.phone,
          'mb-5': formik.errors.phone && formik.touched.phone,
        })}
        controlId="phone"
      >
        <FloatingLabel label={t('signupForm.phone')} controlId="phone">
          <Form.Control
            as={InputMask}
            mask="+7 (999)-999-99-99"
            type="text"
            className="mb-2"
            onChange={formik.handleChange}
            value={formik.values.phone}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.phone && formik.touched.phone}
            onBlur={formik.handleBlur}
            name="phone"
            placeholder={t('signupForm.phone')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right">
            {t(formik.errors.phone)}
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
        <FloatingLabel label={t('signupForm.password')} controlId="password">
          <Form.Control
            className="mb-2"
            onChange={formik.handleChange}
            value={formik.values.password}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.password && formik.touched.password}
            onBlur={formik.handleBlur}
            name="password"
            type="password"
            placeholder={t('signupForm.password')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right">
            {t(formik.errors.password)}
          </Form.Control.Feedback>
        </FloatingLabel>
      </Form.Group>
      <Form.Group
        className={cn('form-floating', {
          'mb-3': !formik.errors.confirmPassword,
          'mb-5': formik.errors.confirmPassword && formik.touched.confirmPassword,
        })}
        controlId="confirmPassword"
      >
        <FloatingLabel label={t('signupForm.confirm')} controlId="confirmPassword">
          <Form.Control
            className="mb-2"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.confirmPassword && formik.touched.confirmPassword}
            onBlur={formik.handleBlur}
            name="confirmPassword"
            type="password"
            placeholder={t('signupForm.confirm')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right">
            {t('signupForm.mustMatch')}
          </Form.Control.Feedback>
        </FloatingLabel>
      </Form.Group>
      <Button variant="outline-primary" className="w-100" type="submit">{t('signupForm.submit')}</Button>
    </Form>
  );
};

export default SignupForm;
