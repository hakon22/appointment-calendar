import { useFormik } from 'formik';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, Form, FloatingLabel, Image,
} from 'react-bootstrap';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import axios from 'axios';
import notify from '../utilities/toast.js';
import { signupValidation } from '../validations/validations.js';
import { MobileContext } from './Context.jsx';
import { upperCase, lowerCase } from '../utilities/textTransform.js';
import routes from '../routes.js';

const SignupForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useContext(MobileContext);

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
        values.username = upperCase(values.username);
        values.email = lowerCase(values.email);
        const { data: { message, code, id } } = await axios.post(routes.signup, values);
        if (code === 1) {
          navigate(`${routes.activationUrlPage}${id}`);
        } else if (code === 2) {
          setSubmitting(false);
          setFieldError('email', message);
        } else if (!code) {
          setSubmitting(false);
          notify(t('toast.networkError'), 'error');
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  const formClass = (field) => cn('mb-3', {
    'mb-3-5': formik.errors[field] && formik.touched[field],
  });

  return (
    <div className="d-flex justify-content-center gap-5">
      {!isMobile && <Image className="w-25 h-25 mt-12 me-4" src="./images/watermelon.svg" alt={t('signupForm.title')} roundedCircle />}
      <Form
        onSubmit={formik.handleSubmit}
        className="col-12 col-md-5"
      >

        <FloatingLabel className={formClass('username')} label={t('signupForm.username')} controlId="username">
          <Form.Control
            autoFocus
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.username && formik.touched.username}
            onBlur={formik.handleBlur}
            name="username"
            placeholder={t('signupForm.username')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
            {t(formik.errors.username)}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className={formClass('email')} label={t('signupForm.email')} controlId="email">
          <Form.Control
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.email && formik.touched.email}
            onBlur={formik.handleBlur}
            name="email"
            placeholder={t('signupForm.email')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
            {t(formik.errors.email)}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className={formClass('phone')} label={t('signupForm.phone')} controlId="phone">
          <Form.Control
            as={InputMask}
            mask="+7 (999)-999-99-99"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.phone}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.phone && formik.touched.phone}
            onBlur={formik.handleBlur}
            name="phone"
            placeholder={t('signupForm.phone')}
            required
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
            {t(formik.errors.phone)}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className={formClass('password')} label={t('signupForm.password')} controlId="password">
          <Form.Control
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
          <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
            {t(formik.errors.password)}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className={formClass('confirmPassword')} label={t('signupForm.confirm')} controlId="confirmPassword">
          <Form.Control
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
          <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
            {t('signupForm.mustMatch')}
          </Form.Control.Feedback>
        </FloatingLabel>

        <Button variant="outline-primary" className="w-100" type="submit">{t('signupForm.submit')}</Button>
      </Form>
    </div>
  );
};

export default SignupForm;
