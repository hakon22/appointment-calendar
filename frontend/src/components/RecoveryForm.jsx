import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button, Form, FloatingLabel, Image, Spinner,
} from 'react-bootstrap';
import cn from 'classnames';
import orange from '../images/orange.svg';
import { fetchLogin } from '../slices/loginSlice.js';
import { AuthContext, MobileContext } from './Context.jsx';
import { emailValidation } from '../validations/validations.js';

const RecoveryForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { logIn } = useContext(AuthContext);
  const isMobile = useContext(MobileContext);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: emailValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
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
    <div className="d-flex justify-content-center align-items-center gap-5">
      {!isMobile && <Image className="w-25 h-25 me-4" src={orange} alt={t('recoveryForm.title')} roundedCircle />}
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
        <Button variant="outline-primary" className="w-100" type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : t('loginForm.recovery')}
        </Button>
      </Form>
    </div>
  );
};

export default RecoveryForm;
