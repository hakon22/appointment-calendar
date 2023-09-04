import { Button, Form } from 'react-bootstrap';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import InputMask from 'react-input-mask';
import axios from 'axios';
import notify from '../utilities/toast.js';
import ApiContext from './Context.jsx';
import routes from '../routes.js';

const ConfirmRecord = ({
  date, stringDate, time, setStatus,
}) => {
  const { t } = useTranslation();
  const { soketRecording } = useContext(ApiContext);
  const {
    username, email, phone, token,
  } = useSelector((state) => state.login);

  const formik = useFormik({
    initialValues: {
      username,
      email,
      phone,
      time,
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await axios.post(routes.recording, { date, stringDate, time }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.code === 1) {
          soketRecording({ date, time });
          setStatus(['home', null]);
          notify(t('toast.recordingSuccess'), 'success');
        } else if (data.code === 2) {
          setSubmitting(false);
          setStatus(['recording', null]);
          notify(t('toast.recordingTimeError'), 'error');
        } else if (data.code === 3) {
          setSubmitting(false);
          setStatus(['recording', null]);
          notify(t('toast.recordingDateError'), 'error');
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
      className="col-xl-7 col-xxl-6"
    >
      <Form.Group className="d-flex align-items-center row mb-2" controlId="username">
        <Form.Label className="col-md-4 col-xl-5">{t('recordForm.username')}</Form.Label>
        <div className="col-md-8 col-xl-7">
          <Form.Control className="" type="text" value={formik.values.username} name="username" disabled />
        </div>
      </Form.Group>

      <Form.Group className="d-flex align-items-center row mb-2" controlId="email">
        <Form.Label className="col-md-4 col-xl-5">{t('recordForm.email')}</Form.Label>
        <div className="col-md-8 col-xl-7">
          <Form.Control className="" type="email" value={formik.values.email} name="email" disabled />
        </div>
      </Form.Group>

      <Form.Group className="d-flex align-items-center row mb-2" controlId="phone">
        <Form.Label className="col-md-4 col-xl-5">{t('recordForm.phone')}</Form.Label>
        <div className="col-md-8 col-xl-7">
          <Form.Control
            as={InputMask}
            className=""
            mask="+7 (999)-999-99-99"
            type="text"
            value={formik.values.phone}
            name="phone"
            disabled
          />
        </div>
      </Form.Group>
      <Form.Group className="d-flex align-items-center row mb-4" controlId="time">
        <Form.Label className="col-md-4 col-xl-5">{t('recordForm.time')}</Form.Label>
        <div className="col-md-8 col-xl-7">
          <Form.Control type="time" className="w-auto mb-2" name="time" value={formik.values.time} disabled />
        </div>
      </Form.Group>
      <div className="d-flex justify-content-between">
        <Button variant="success" type="submit" size="sm" disabled={formik.isSubmitting}>{t('recordForm.recording')}</Button>
        <Button variant="secondary" type="button" size="sm" onClick={() => setStatus(['recording', null])} disabled={formik.isSubmitting}>{t('recordForm.back')}</Button>
      </div>
    </Form>
  );
};

export default ConfirmRecord;
