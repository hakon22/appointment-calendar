import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import {
  Button, Form, FloatingLabel, Image, Spinner, Alert,
} from 'react-bootstrap';
import cn from 'classnames';
import axios from 'axios';
import orange from '../images/orange.svg';
import { MobileContext } from './Context.jsx';
import notify from '../utilities/toast.js';
import { lowerCase } from '../utilities/textTransform.js';
import { emailValidation } from '../validations/validations.js';
import routes from '../routes.js';

const RecoveryForm = () => {
  const { t } = useTranslation();
  const isMobile = useContext(MobileContext);

  const [sendMail, setSendMail] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: emailValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        values.email = lowerCase(values.email);
        const { data } = await axios.post(routes.recoveryPassword, values);
        if (data.code === 1) {
          setSendMail(values.email);
          notify(t('toast.emailSuccess'), 'success');
        } else if (data.code === 2) {
          setSubmitting(false);
          setFieldError('email', t('validation.userNotAlreadyExists'));
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
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
      {sendMail ? (
        <Alert as="div" variant="primary" className="col-12 col-md-5 text-center mb-0">
          <span>{t('recoveryForm.toYourMail')}</span>
          <br />
          <span><b>{sendMail}</b></span>
          <p>{t('recoveryForm.postNewPassword')}</p>
          <span>{t('recoveryForm.youCanChange')}</span>
        </Alert>
      ) : (
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
      )}
    </div>
  );
};

export default RecoveryForm;
