import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, Form, FloatingLabel, Image,
} from 'react-bootstrap';
import cn from 'classnames';
import pear from '../images/pear.svg';
import { fetchLogin } from '../slices/loginSlice.js';
import { AuthContext, MobileContext } from './Context.jsx';
import { loginValidation } from '../validations/validations.js';

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
        } else if (code === 3) {
          setSubmitting(false);
          setFieldError('email', message);
        } else if (!code) {
          setSubmitting(false);
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  const formClass = (field) => cn('mb-3', {
    'mb-3-5': formik.errors[field] && formik.touched[field],
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
            isInvalid={formik.errors.email && formik.touched.email}
            onBlur={formik.handleBlur}
            name="email"
            placeholder={t('loginForm.email')}
            required
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
            isInvalid={formik.errors.password && formik.touched.password}
            onBlur={formik.handleBlur}
            name="password"
            type="password"
            placeholder={t('loginForm.password')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
            {t(formik.errors.password)}
          </Form.Control.Feedback>
        </FloatingLabel>
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
        <Button variant="outline-primary" className="w-100" type="submit" disabled={formik.isSubmitting}>{t('loginForm.submit')}</Button>
      </Form>
    </div>
  );
};

export default LoginForm;
