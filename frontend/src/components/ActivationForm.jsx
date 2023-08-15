import { useFormik } from 'formik';
import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import axios from 'axios';
import cn from 'classnames';
import {
  Button, Form, FloatingLabel, Image, DropdownButton, ButtonGroup, Dropdown,
} from 'react-bootstrap';
import { EnvelopeAt } from 'react-bootstrap-icons';
import notify from '../utilities/toast.js';
import { updateTokens } from '../slices/loginSlice.js';
import { MobileContext } from './Context.jsx';
import ModalChangeActivationEmail from './Modals.jsx';
import { activationValidation } from '../validations/validations.js';
import pineapple from '../images/pineapple.svg';
import routes from '../routes.js';

const ActivationForm = ({ id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useContext(MobileContext);
  const { email } = useSelector((state) => state.login);
  const [timer, setTimer] = useState(59);
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);

  const repeatEmail = async () => {
    try {
      const { data } = await axios.get(`${routes.activationRepeatEmail}${id}`);
      if (data) {
        setTimer(59);
        notify(t('toast.emailSuccess'), 'success');
      }
    } catch (e) {
      notify(t('toast.unknownError'), 'error');
      console.log(e);
    }
  };

  const formik = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: activationValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const {
          data:
          { code, message, refreshToken },
        } = await axios.post(routes.activation, { ...values, id });
        if (code === 1 && refreshToken) {
          await dispatch(updateTokens(refreshToken));
          navigate(routes.homePage);
          notify(t('toast.activationSuccess'), 'success');
        } else if (code === 2) {
          setSubmitting(false);
          setFieldError('code', message);
        } else if (!code) {
          notify(t('toast.networkError'), 'error');
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  useEffect(() => {
    if (timer !== '00') {
      const decrementValue = timer < 11 ? `0${timer - 1}` : timer - 1;
      const timerAlive = setTimeout(setTimer, 1000, decrementValue);
      return () => clearTimeout(timerAlive);
    }
    return undefined;
  }, [timer]);

  const formClass = (field) => cn('mb-3-5 col-lg-7 mx-auto', {
    'mb-5': formik.errors[field] && formik.touched[field],
  });

  return (
    <div className={cn('d-flex justify-content-center align-items-center gap-3', {
      'flex-column': isMobile,
      'gap-1': !isMobile,
    })}
    >
      <Image
        className={cn('mx-auto w-25 h-25', {
          'w-50 h-50 mb-2 mt-3': isMobile,
          'me-2 mb-4': !isMobile,
        })}
        src={pineapple}
        alt={t('loginForm.title')}
        roundedCircle
      />
      <ModalChangeActivationEmail id={id} email={email} show={show} onHide={modalClose} />
      <Form
        onSubmit={formik.handleSubmit}
        className={cn('col-12 col-md-7 mb-4', {
          'mt-4': !isMobile,
        })}
      >
        <div>{t('activationForm.toYourMail')}</div>
        <DropdownButton
          as={ButtonGroup}
          size="sm"
          variant="warning"
          className="mt-1 mb-1"
          title={email}
          autoClose="inside"
        >
          <Dropdown.Item eventKey="1" onClick={modalShow}>{t('activationForm.dropMenuChange')}</Dropdown.Item>
        </DropdownButton>
        <div className="d-block mb-3">{t('activationForm.postConfirmCode')}</div>
        <FloatingLabel className={formClass('code')} label={t('activationForm.code')} controlId="code">
          <Form.Control
            autoFocus
            as={InputMask}
            mask="9999"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.code}
            disabled={formik.isSubmitting}
            isInvalid={formik.errors.code && formik.submitCount > 0}
            onBlur={formik.handleBlur}
            name="code"
            placeholder={t('activationForm.code')}
          />
          <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
            {t(formik.errors.code)}
          </Form.Control.Feedback>
        </FloatingLabel>
        { timer !== '00'
          ? (<p className="text-muted mb-3-5">{`${t('activationForm.timerText')}${timer}`}</p>)
          : (
            <Button onClick={repeatEmail} variant="warning" className="mb-3-5 anim-show" size="sm" disabled={formik.isSubmitting}>
              <EnvelopeAt />
              {t('activationForm.timerButton')}
            </Button>
          )}
        <Button variant="outline-primary" type="submit" disabled={formik.isSubmitting}>{t('activationForm.submit')}</Button>
      </Form>
    </div>
  );
};

export default ActivationForm;
