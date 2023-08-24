import { useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import axios from 'axios';
import routes from '../routes.js';
import ApiContext from './Context.jsx';
import { changeEmailActivation } from '../slices/loginSlice.js';
import notify from '../utilities/toast.js';
import { emailValidation, timeValidation } from '../validations/validations.js';

export const ModalChangeActivationEmail = ({
  id, email, onHide, show,
}) => {
  const { t } = useTranslation();
  const input = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email,
    },
    validationSchema: emailValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const { data } = await axios.post(routes.activationChangeEmail, { ...values, id });
        if (data.code === 1) {
          dispatch(changeEmailActivation(values.email));
          onHide();
          notify(t('toast.changeEmailSuccess'), 'success');
        } else if (data.code === 2) {
          setSubmitting(false);
          setFieldError('email', data.message);
        } else if (!data) {
          navigate(routes.loginPage);
          notify(t('toast.doesNotRequireActivation'), 'error');
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  return (
    <Modal
      show={show}
      onHide={() => {
        onHide();
        formik.errors.email = '';
      }}
      centered
      onShow={() => {
        formik.values.email = email;
        setTimeout(() => input.current.select(), 1);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.changeEmailTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={formik.handleSubmit}
        >
          <Form.Group className="position-relative" controlId="email">
            <Form.Label className="visually-hidden">{t('modal.newEmail')}</Form.Label>
            <Form.Control
              autoFocus
              ref={input}
              className="mb-3-5 mt-1"
              onChange={formik.handleChange}
              value={formik.values.email}
              disabled={formik.isSubmitting}
              isInvalid={formik.errors.email && formik.touched.email}
              onBlur={formik.handleBlur}
              name="email"
            />
            <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
              {t(formik.errors.email)}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              className="me-2"
              variant="secondary"
              onClick={() => {
                onHide();
                formik.errors.email = '';
              }}
            >
              {t('modal.close')}
            </Button>
            <Button variant="success" type="submit" disabled={formik.isSubmitting}>
              {t('modal.submitChange')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export const ModalTimesHandler = ({
  date, obj, onHide, show,
}) => {
  const { t } = useTranslation();
  const input = useRef();
  const { soketChangeTime, soketRemoveTime, soketRemoveDate } = useContext(ApiContext);

  const { token } = useSelector((state) => state.login);

  const { time, act, user } = obj;

  const formik = useFormik({
    initialValues: {
      time,
    },
    validationSchema: timeValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const patchData = { ...values, oldTime: time, date };
        const { data } = await axios.patch(routes.changeTime, patchData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.time) {
          soketChangeTime(data.time);
          onHide();
          notify(t('toast.timeChangeSuccess'), 'success');
        } else if (data.code === 2) {
          setSubmitting(false);
          setFieldError('time', t('validation.coincidenceTime'));
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  const formikRemoveTime = useFormik({
    initialValues: {},
    onSubmit: async () => {
      try {
        const { data } = await axios.delete(routes.removeTime, {
          params: { date, time },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.time) {
          soketRemoveTime(data.time);
          onHide();
          notify(t('toast.timeRemoveSuccess'), 'success');
        } else if (data.code === 2) {
          onHide();
          notify(t('toast.removeTimeError'), 'error');
        } else if (!data.time) {
          soketRemoveDate(date);
          onHide();
          notify(t('toast.closeDateSuccess'), 'success');
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  const formikRemoveDate = useFormik({
    initialValues: {},
    onSubmit: async () => {
      try {
        const { data } = await axios.delete(routes.removeDate, {
          params: { date, time },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.code === 1) {
          soketRemoveDate(date);
          onHide();
          notify(t('toast.closeDateSuccess'), 'success');
        } else if (data.code === 2) {
          onHide();
          notify(t('toast.closeDateError'), 'error');
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  return !act ? (
    <Modal
      show={show}
      onHide={() => {
        onHide();
        formik.errors.time = '';
      }}
      centered
      onShow={() => {
        formik.values.time = time;
        setTimeout(() => input.current.focus(), 1);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.changeTimeTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={formik.handleSubmit}
        >
          <Form.Group className="position-relative" controlId="time">
            <Form.Label className="visually-hidden">{t('modal.newTime')}</Form.Label>
            <Form.Control
              autoFocus
              type="time"
              ref={input}
              className="mb-3-5 mt-1 w-auto"
              onChange={formik.handleChange}
              value={formik.values.time}
              disabled={formik.isSubmitting}
              isInvalid={formik.errors.time && formik.touched.time}
              onBlur={formik.handleBlur}
              name="time"
            />
            <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
              {t(formik.errors.time)}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              className="me-2"
              variant="secondary"
              onClick={() => {
                onHide();
                formik.errors.time = '';
              }}
            >
              {t('modal.close')}
            </Button>
            <Button variant="success" type="submit" disabled={formik.isSubmitting}>
              {t('modal.submitChange')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  ) : (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{act === 'removeDate' ? t('modal.removeDateTitle') : t('modal.removeTimeTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{act === 'removeDate' ? t('modal.removeDateBody', { time }) : t('modal.removeTimeBody', { time: time[0] })}</p>
        {(act === 'removeDate' || user) && <p className="mb-4">{t('modal.removeDateBody2')}</p>}
        <div className="d-flex justify-content-end">
          <Form
            onSubmit={act === 'removeDate' ? formikRemoveDate.handleSubmit : formikRemoveTime.handleSubmit}
          >
            <Button className="me-2" variant="secondary" onClick={onHide}>
              {t('modal.close')}
            </Button>
            <Button
              variant="danger"
              type="submit"
              disabled={act === 'removeDate' ? formikRemoveDate.isSubmitting : formikRemoveTime.isSubmitting}
            >
              {t('modal.submitRemove')}
            </Button>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
