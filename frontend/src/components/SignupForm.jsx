import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useContext, useRef } from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { fetchSignup } from '../slices/signupSlice.js';
import AuthContext from './Context.jsx';
import { registrationFormValidation } from '../validations/validations.js';

const SignupForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const inputRef = useRef();
  const { loggedIn, logIn } = useContext(AuthContext);
  const { loadingStatus } = useSelector((state) => state.loading);

  useEffect(() => {
    if (loggedIn) {
      window.location.replace('/');
    }
  }, [loggedIn]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registrationFormValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      const { meta: { requestStatus } } = await dispatch(fetchSignup(values));
      if (requestStatus === 'fulfilled') {
        logIn();
      } else {
        setSubmitting(false);
        setFieldError('registration', 'reg');
        setTimeout(() => inputRef.current.select(), 1);
      }
    },
  });

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className="w-50"
    >
      <h1 className="text-center mb-4">{t('signup.title')}</h1>
      <Form.Group className="form-floating mb-3" controlId="username">
        <FloatingLabel className={formik.values.username && 'filled'} label={t('signup.username')} controlId="username">
          <Form.Control
            ref={inputRef}
            className="mb-2"
            onChange={formik.handleChange}
            value={formik.values.username}
            autoFocus
            disabled={loadingStatus === 'loading' || formik.isSubmitting}
            isInvalid={(formik.errors.username && formik.touched.username)
              || formik.errors.registration}
            onBlur={formik.handleBlur}
            name="username"
            placeholder={t('signup.username')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right">
            {formik.errors.registration ? t('signup.alreadyExists') : t(formik.errors.username)}
          </Form.Control.Feedback>
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="form-floating mb-3" controlId="password">
        <FloatingLabel className={formik.values.password && 'filled'} label={t('signup.password')} controlId="password">
          <Form.Control
            className="mb-2"
            onChange={formik.handleChange}
            value={formik.values.password}
            disabled={loadingStatus === 'loading' || formik.isSubmitting}
            isInvalid={formik.errors.password && formik.touched.password}
            onBlur={formik.handleBlur}
            name="password"
            type="password"
            placeholder={t('signup.password')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right">
            {t(formik.errors.password)}
          </Form.Control.Feedback>
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="form-floating mb-4" controlId="confirmPassword">
        <FloatingLabel className={formik.values.confirmPassword && 'filled'} label={t('signup.confirm')} controlId="confirmPassword">
          <Form.Control
            className="mb-2"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            disabled={loadingStatus === 'loading' || formik.isSubmitting}
            isInvalid={formik.errors.confirmPassword && formik.touched.confirmPassword}
            onBlur={formik.handleBlur}
            name="confirmPassword"
            type="password"
            placeholder={t('signup.confirm')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip>
            {t('signup.mustMatch')}
          </Form.Control.Feedback>
        </FloatingLabel>
      </Form.Group>
      <Button variant="outline-primary" className="w-100" type="submit">{t('signup.submit')}</Button>
    </Form>
  );
};

export default SignupForm;
