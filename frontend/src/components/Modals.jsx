import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import axios from 'axios';
import routes from '../routes.js';
import { changeEmailActivation } from '../slices/loginSlice.js';
import notify from '../utilities/toast.js';
import { emailValidation } from '../validations/validations.js';

const ModalChangeActivationEmail = ({
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

export default ModalChangeActivationEmail;
