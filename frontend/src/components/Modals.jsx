import { useRef } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { signupValidation } from '../validations/validations.js';

const ModalChangeActivationEmail = ({ email, onHide, show }) => {
  const { t } = useTranslation();
  const input = useRef();

  const formik = useFormik({
    initialValues: {
      email,
    },
    validationSchema: signupValidation,
    onSubmit: (values, { setSubmitting, setTouched }) => {
      if (!email) {
        formik.values.email = email;
        setSubmitting(false);
        setTouched({ email: true });
        return;
      }
      onHide();
      formik.errors.email = '';
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
