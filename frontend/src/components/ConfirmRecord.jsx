import { Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import InputMask from 'react-input-mask';
import notify from '../utilities/toast.js';

const ConfirmRecord = ({ date, stringDate, time }) => {
  const { t } = useTranslation();
  const { username, email, phone } = useSelector((state) => state.login);
  console.log(time);

  const formik = useFormik({
    initialValues: {
      username,
      email,
      phone,
      time,
    },
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const { data: { message, code, id } } = await axios.post(routes.signup, values);
        if (code === 1) {
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

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className="col-12"
    >
      <Form.Group className="row mb-2 d-flex justify-content-start" controlId="username">
        <Form.Label column>{t('recordForm.username')}</Form.Label>
        <div className="col">
          <Form.Control className="w-auto" type="text" value={formik.values.username} name="username" disabled />
        </div>
      </Form.Group>

      <Form.Group className="row mb-2" controlId="email">
        <Form.Label column>{t('recordForm.email')}</Form.Label>
        <div className="col">
          <Form.Control type="email" value={formik.values.email} name="email" disabled />
        </div>
      </Form.Group>

      <Form.Group className="row mb-2" controlId="phone">
        <Form.Label column>{t('recordForm.phone')}</Form.Label>
        <div className="col">
          <Form.Control
            as={InputMask}
            mask="+7 (999)-999-99-99"
            type="text"
            value={formik.values.phone}
            name="phone"
            disabled
          />
        </div>
      </Form.Group>
      <Form.Group className="row mb-2" controlId="time">
        <Form.Label column>{t('recordForm.time')}</Form.Label>
        <div className="col">
          <Form.Control type="time" className="w-auto mb-2" name="time" value={formik.values.time} disabled />
        </div>
      </Form.Group>
    </Form>
  );
};

export default ConfirmRecord;
