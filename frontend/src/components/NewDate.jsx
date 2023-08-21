import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { addNewDate } from '../slices/calendarSlice.js';

const NewDate = ({ date }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.login);

  const formik = useFormik({
    initialValues: {
      date,
    },
    onSubmit: async (values) => {
      try {
        dispatch(addNewDate({ token, values }));
      } catch (e) {
        console.log(e);
      }
    },
  });

  const [fieldCount, setField] = useState([]);
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
        <p>{t('calendar.newDate.emptyDate')}</p>
        <Button variant="outline-primary" onClick={incrementField} size="sm" type="button">{t('calendar.newDate.openDate')}</Button>
      </>
    )
    : (
      <Form
        onSubmit={formik.handleSubmit}
        className="col-6"
      >
        {Object.keys(formik.values).map((value) => value !== 'date' && (
          <div key={value} className="d-flex mb-3 gap-5">
            <Form.Control
              type="time"
              name={value}
              onChange={formik.handleChange}
              value={formik.values[value]}
              disabled={formik.isSubmitting}
              onBlur={formik.handleBlur}
              required
            />
            <Button variant="outline-primary" type="button" size="sm" onClick={() => decrementField(value)} disabled={formik.isSubmitting}>{t('calendar.newDate.removeField')}</Button>
          </div>
        ))}
        <div className="d-flex justify-content-between gap-5">
          <Button variant="primary" type="submit" size="sm" disabled={formik.isSubmitting}>{t('calendar.newDate.saveTimes')}</Button>
          <Button variant="outline-primary" type="button" size="sm" onClick={incrementField} disabled={formik.isSubmitting}>{t('calendar.newDate.addField')}</Button>
        </div>
      </Form>
    );
};

export default NewDate;
