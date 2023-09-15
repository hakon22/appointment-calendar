import { Button, Form, Spinner } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import cn from 'classnames';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ApiContext from './Context.jsx';
import notify from '../utilities/toast.js';
import routes from '../routes.js';

const NewDate = ({ date, time }) => {
  const { t } = useTranslation();
  const { soketAddNewDate, soketAddNewTime } = useContext(ApiContext);
  const { token } = useSelector((state) => state.login);

  const [fieldCount, setField] = useState([]);

  const formik = useFormik({
    initialValues: {
      date,
    },
    onSubmit: async (values, { setFieldError, setSubmitting, resetForm }) => {
      try {
        if (!time) {
          const { data } = await axios.post(routes.setDate, values, {
            headers: { Authorization: `Bearer ${token}` },
          });
          resetForm({ values: { date } });
          setField([]);
          soketAddNewDate(data);
          notify(t('toast.addNewDateSuccess'), 'success');
        } else {
          const { data } = await axios.patch(routes.addNewTime, values, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.code === 1) {
            resetForm({ values: { date } });
            setField([]);
            soketAddNewTime(data);
            notify(t('toast.addNewTimeSuccess'), 'success');
          } else if (data.code === 2) {
            setSubmitting(false);
            data.errorFields.forEach((value) => {
              const currentField = Object.keys(formik.values)
                .find((key) => formik.values[key] === value);
              setFieldError(currentField, t('validation.coincidenceTime'));
            });
          }
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  const incrementField = () => {
    const nextValue = () => {
      for (let i = 0; ; i += 1) {
        if (!fieldCount.includes(i)) return i;
      }
    };
    const nextNum = nextValue();
    fieldCount.push(nextNum);
    const newFormikValues = { ...formik.values, [`time${nextNum}`]: '' };
    formik.setValues(newFormikValues);
    setField([...fieldCount]);
  };
  const decrementField = (name) => {
    if (fieldCount.length >= 0) {
      const newFormikValues = Object.entries(formik.values).reduce((acc, [key, value]) => {
        if (key !== name) {
          acc[key] = value;
        }
        return acc;
      }, {});
      formik.resetForm({
        values: newFormikValues,
      });
      const newFieldCount = fieldCount.filter((num) => num !== parseInt(name.match(/\d+/), 10));
      setField([...newFieldCount]);
    }
  };

  return fieldCount.length === 0
    ? (
      <>
        {!time && <p>{t('calendar.newDate.emptyDate')}</p>}
        <Button className="me-4 me-md-5" variant="outline-primary" onClick={incrementField} size="sm" type="button">{time ? t('calendar.newDate.addTime') : t('calendar.newDate.openDate')}</Button>
      </>
    )
    : (
      <Form
        onSubmit={formik.handleSubmit}
        className="col-md-8 col-lg-6 d-flex flex-column"
      >
        {Object.keys(formik.values).map((value) => value !== 'date' && (
          <div
            key={value}
            className={cn('d-flex justify-content-between mb-3 gap-5 position-relative', {
              'mb-3-5': formik.errors[value] && formik.submitCount > 0,
            })}
          >
            <Form.Control
              autoFocus
              type="time"
              className="w-auto"
              name={value}
              onChange={formik.handleChange}
              isInvalid={formik.errors[value] && formik.submitCount > 0}
              value={formik.values[value]}
              disabled={formik.isSubmitting}
              onBlur={formik.handleBlur}
              required
            />
            <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
              {t(formik.errors[value])}
            </Form.Control.Feedback>
            <Button variant="outline-primary" type="button" size="sm" onClick={() => decrementField(value)} disabled={formik.isSubmitting}>{t('calendar.newDate.removeField')}</Button>
          </div>
        ))}
        <div className={cn('d-flex justify-content-between mt-4 gap-5', {
          'mb-4': time,
        })}
        >
          <Button variant="primary" type="submit" size="sm" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : t('calendar.newDate.saveTimes')}
          </Button>
          <Button variant="outline-primary" type="button" size="sm" onClick={incrementField} disabled={formik.isSubmitting}>{t('calendar.newDate.addField')}</Button>
        </div>
      </Form>
    );
};

export default NewDate;
