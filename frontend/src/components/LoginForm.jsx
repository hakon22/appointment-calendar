import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, Form, FloatingLabel, Image, Alert, Spinner,
} from 'react-bootstrap';
import cn from 'classnames';
import pear from '../images/pear.svg';
import { fetchLogin } from '../slices/loginSlice.js';
import { AuthContext, MobileContext } from './Context.jsx';
import { lowerCase } from '../utilities/textTransform.js';
import { loginValidation } from '../validations/validations.js';
import routes from '../routes.js';

const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { logIn } = useContext(AuthContext);
  const isMobile = useContext(MobileContext);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      save: false,
    },
    validationSchema: loginValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        values.email = lowerCase(values.email);
        const {
          payload: { token, refreshToken, code },
        } = await dispatch(fetchLogin(values));
        if (token) {
          if (values.save) {
            window.localStorage.setItem('refresh_token', refreshToken);
          }
          logIn();
        } else if (code === 1) {
          setSubmitting(false);
          setFieldError('email', t('validation.userNotAlreadyExists'));
        } else if (code === 2) {
          setSubmitting(false);
          setFieldError('password', t('validation.incorrectPassword'));
        } else if (code === 3) {
          setSubmitting(false);
          setFieldError('email', t('validation.accountNotActivated'));
        } else if (!code) {
          setSubmitting(false);
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  const formClass = (field) => cn('mb-3', {
    'mb-3-5': formik.errors[field] && formik.touched[field] && formik.submitCount,
  });

  return (
    <div className="d-flex justify-content-center gap-5">
      {!isMobile && <Image className="w-25 h-25 mt-md-3 mt-xxl-1 me-4" src={pear} alt={t('loginForm.title')} roundedCircle />}
      <Form
        onSubmit={formik.handleSubmit}
        className="col-12 col-md-5"
      >
        <FloatingLabel className={formClass('email')} label={t('loginForm.email')} controlId="email">
          <Form.Control
            autoFocus
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.email && formik.submitCount}
            onBlur={formik.handleBlur}
            name="email"
            autoComplete="on"
            placeholder={t('loginForm.email')}
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
            {t(formik.errors.email)}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className={formClass('password')} label={t('loginForm.password')} controlId="password">
          <Form.Control
            onChange={formik.handleChange}
            value={formik.values.password}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.password && formik.submitCount}
            onBlur={formik.handleBlur}
            name="password"
            type="password"
            placeholder={t('loginForm.password')}
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
            {t(formik.errors.password)}
          </Form.Control.Feedback>
        </FloatingLabel>
        {formik.submitCount > 2 && (
          <Alert as="div" className="mb-3 text-start pt-1 pb-1" variant="primary">
            <span>{t('loginForm.forgotPassword')}</span>
            <Link to={routes.recoveryPasswordPage}>{t('loginForm.recovery')}</Link>
          </Alert>
        )}
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
        <Button variant="outline-primary" className="w-100" type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : t('loginForm.submit')}
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
