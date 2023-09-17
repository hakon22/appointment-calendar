/* eslint-disable react-hooks/exhaustive-deps */
import { Form, InputGroup, Spinner } from 'react-bootstrap';
import {
  useContext, useState, useRef, useEffect,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Pencil, CheckLg, XLg } from 'react-bootstrap-icons';
import InputMask from 'react-input-mask';
import axios from 'axios';
import cn from 'classnames';
import { isEmpty } from 'lodash';
import notify from '../utilities/toast.js';
import { changeUserData } from '../slices/loginSlice.js';
import { upperCase, lowerCase } from '../utilities/textTransform.js';
import ApiContext from './Context.jsx';
import { settingsValidation, passwordsValidation, continuePasswordValidation } from '../validations/validations.js';
import routes from '../routes.js';

const ChangeData = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { soketRecording } = useContext(ApiContext);
  const {
    username, email, phone, token, record,
  } = useSelector((state) => state.login);

  const usernameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();

  const [usernameEdit, setUsernameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [phoneEdit, setPhoneEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [continueChangePass, setContinueChangePass] = useState(false);
  const [continueChangeEmail, setContinueChangeEmail] = useState(false);

  const initialValues = {
    username, email, phone, code: '',
  };

  const setDefaultValue = (field, form) => {
    if (field !== 'password') {
      form.resetForm({ values: initialValues, submitCount: 0 });
    }
    if (field === 'username') {
      setUsernameEdit(false);
    } else if (field === 'email') {
      setEmailEdit(false);
      if (continueChangeEmail) {
        axios.get(routes.cancelChangeEmail, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContinueChangeEmail(false);
      }
    } else if (field === 'phone') {
      setPhoneEdit(false);
    } else if (field === 'password') {
      form.handleReset();
      setPasswordEdit(false);
      if (continueChangePass) {
        setContinueChangePass(false);
      }
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: settingsValidation,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        if (values.username) {
          values.username = upperCase(values.username);
        }
        if (values.email) {
          values.email = lowerCase(values.email);
        }
        const changedValue = Object.keys(values).reduce((acc, key) => {
          if (initialValues[key] === values[key]) {
            return acc;
          }
          return continueChangeEmail
            ? { email: continueChangeEmail, [key]: values[key] }
            : { [key]: values[key] };
        }, {});
        if (isEmpty(changedValue)) {
          setDefaultValue(Object.keys(values)[0], formik);
        } else {
          const { data } = await axios.post(routes.changeUserData, changedValue, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.code === 1) {
            const field = Object.keys(changedValue)[0];
            const dateTimeRecord = Object.entries(record);
            dispatch(changeUserData(changedValue));
            setDefaultValue(field, formik);
            if (dateTimeRecord.length) {
              soketRecording({ date: dateTimeRecord[0][0], time: dateTimeRecord[0][1].time[0] });
            }
            notify(t(`toast.${field}ChangeSuccess`), 'success');
          } else if (data.code === 2) {
            setSubmitting(false);
            setFieldError('email', t('validation.emailAlreadyExists'));
          } else if (data.code === 3) {
            formik.handleReset();
            setContinueChangeEmail(values.email);
            emailRef.current.focus();
          } else if (data.code === 4) {
            setSubmitting(false);
            setFieldError('code', t('validation.incorrectCode'));
          }
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  const formikPass = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: continueChangePass ? continuePasswordValidation : passwordsValidation,
    onSubmit: async ({ password }, { setSubmitting, setFieldError }) => {
      try {
        const { data } = await axios.post(routes.changePass, { password, continueChangePass }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.code === 1) {
          formikPass.handleReset();
          setContinueChangePass(true);
          passwordRef.current.focus();
        } else if (data.code === 2) {
          setSubmitting(false);
          setFieldError('password', t('validation.incorrectPassword'));
        } else if (data.code === 3) {
          setSubmitting(false);
          setFieldError('password', t('validation.matchPassword'));
        } else if (data.code === 4) {
          setDefaultValue('password', formikPass);
          notify(t('toast.changePassSuccess'), 'success');
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  const setPhoneRef = (el) => {
    if (!phoneRef.current) {
      phoneRef.current = el;
    }
  };

  useEffect(() => {
    if (usernameEdit) {
      if (emailEdit) {
        setDefaultValue('email', formik);
      }
      if (phoneEdit) {
        setDefaultValue('phone', formik);
      }
      if (passwordEdit) {
        setDefaultValue('password', formikPass);
      }
      usernameRef.current.select();
    } else {
      setDefaultValue('username', formik);
    }
  }, [usernameEdit]);

  useEffect(() => {
    if (emailEdit) {
      if (usernameEdit) {
        setDefaultValue('username', formik);
      }
      if (phoneEdit) {
        setDefaultValue('phone', formik);
      }
      if (passwordEdit) {
        setDefaultValue('password', formikPass);
      }
      emailRef.current.select();
    } else {
      setDefaultValue('email', formik);
    }
  }, [emailEdit]);

  useEffect(() => {
    if (phoneEdit) {
      if (emailEdit) {
        setDefaultValue('email', formik);
      }
      if (usernameEdit) {
        setDefaultValue('username', formik);
      }
      if (passwordEdit) {
        setDefaultValue('password', formikPass);
      }
      setTimeout(() => phoneRef.current.select(), 1);
    } else {
      setDefaultValue('phone', formik);
    }
  }, [phoneEdit]);

  useEffect(() => {
    if (passwordEdit) {
      if (emailEdit) {
        setDefaultValue('email', formik);
      }
      if (usernameEdit) {
        setDefaultValue('username', formik);
      }
      if (phoneEdit) {
        setDefaultValue('phone', formik);
      }
      passwordRef.current.focus();
    } else {
      setDefaultValue('password', formikPass);
    }
  }, [passwordEdit]);

  const placeholderGen = () => {
    if (passwordEdit) {
      if (continueChangePass) {
        return t('settingsForm.newPassword');
      }
      return t('settingsForm.oldPassword');
    }
    return '••••••';
  };

  const formClass = (field, form = formik) => cn('d-flex flex-wrap flex-md-nowrap align-items-center mb-2', {
    'mb-3-5': form.errors[field] && form.touched[field] && form.submitCount,
  });

  return (
    <>
      <Form
        onSubmit={formik.handleSubmit}
        className="col-xl-10 col-xxl-7 change-data"
      >
        <Form.Group className={formClass('username')} controlId="username">
          <Form.Label className="col-12 col-xl-4 col-xxl-4">{t('recordForm.username')}</Form.Label>
          <InputGroup>
            <Form.Control
              ref={usernameRef}
              onChange={formik.handleChange}
              onBlur={() => {
                if (formik.values.username === username) {
                  setDefaultValue('username', formik);
                }
              }}
              isInvalid={formik.errors.username && formik.submitCount}
              autoComplete="on"
              type="text"
              value={formik.values.username}
              name="username"
              placeholder={t('signupForm.username')}
              disabled={!usernameEdit}
            />
            {usernameEdit ? (
              <InputGroup.Text
                id="username"
                as="button"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      variant="success"
                    />
                  )
                  : <CheckLg className="fw-bold fs-4 text-success" />}
              </InputGroup.Text>
            ) : (
              <InputGroup.Text
                id="username"
                role="button"
                onClick={() => setUsernameEdit(true)}
              >
                <Pencil />
              </InputGroup.Text>
            )}
            {usernameEdit
          && (
          <InputGroup.Text role="button" onClick={() => setDefaultValue('username', formik)}>
            <XLg className="fw-bold fs-5 text-danger" />
          </InputGroup.Text>
          )}
            <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
              {t(formik.errors.username)}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        {!continueChangeEmail ? (
          <Form.Group className={formClass('email')} controlId="email">
            <Form.Label className="col-12 col-xl-4 col-xxl-4">{t('recordForm.email')}</Form.Label>
            <InputGroup>
              <Form.Control
                ref={emailRef}
                onChange={formik.handleChange}
                onBlur={() => {
                  if (formik.values.email === email) {
                    setDefaultValue('email', formik);
                  }
                }}
                isInvalid={formik.errors.email && formik.submitCount}
                autoComplete="on"
                type="email"
                value={formik.values.email}
                name="email"
                placeholder={t('signupForm.email')}
                disabled={!emailEdit}
              />
              {emailEdit ? (
                <InputGroup.Text
                  id="email"
                  as="button"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting
                    ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        variant="success"
                      />
                    )
                    : <CheckLg className="fw-bold fs-4 text-success" />}
                </InputGroup.Text>
              ) : (
                <InputGroup.Text
                  id="email"
                  role="button"
                  onClick={() => setEmailEdit(true)}
                >
                  <Pencil />
                </InputGroup.Text>
              )}
              {emailEdit
          && (
          <InputGroup.Text role="button" onClick={() => setDefaultValue('email', formik)}>
            <XLg className="fw-bold fs-5 text-danger" />
          </InputGroup.Text>
          )}
              <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
                {t(formik.errors.email)}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        ) : (
          <Form.Group className={formClass('code')} controlId="code">
            <Form.Label className="col-12 col-xl-4 col-xxl-4">{t('activationForm.code')}</Form.Label>
            <InputGroup>
              <Form.Control
                ref={emailRef}
                onChange={formik.handleChange}
                onBlur={(formik.handleBlur)}
                isInvalid={formik.errors.code && formik.submitCount}
                autoComplete="on"
                type="text"
                value={formik.values.code}
                name="code"
                placeholder={t('activationForm.code')}
              />
              <InputGroup.Text
                id="email"
                as="button"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      variant="success"
                    />
                  )
                  : <CheckLg className="fw-bold fs-4 text-success" />}
              </InputGroup.Text>
              <InputGroup.Text role="button" onClick={() => setDefaultValue('email', formik)}>
                <XLg className="fw-bold fs-5 text-danger" />
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
                {t(formik.errors.code)}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        )}

        <Form.Group className={formClass('phone')} controlId="phone">
          <Form.Label className="col-12 col-xl-4 col-xxl-4">{t('recordForm.phone')}</Form.Label>
          <InputGroup>
            <Form.Control
              inputRef={(el) => setPhoneRef(el)}
              onChange={formik.handleChange}
              onBlur={() => {
                if (formik.values.phone === phone) {
                  setDefaultValue('phone', formik);
                }
              }}
              isInvalid={formik.errors.phone && formik.submitCount}
              as={InputMask}
              mask="+7 (999)-999-99-99"
              type="text"
              value={formik.values.phone}
              name="phone"
              autoComplete="off"
              placeholder={t('signupForm.phone')}
              disabled={!phoneEdit}
            />
            {phoneEdit ? (
              <InputGroup.Text
                id="phone"
                as="button"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting
                  ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      variant="success"
                    />
                  )
                  : <CheckLg className="fw-bold fs-4 text-success" />}
              </InputGroup.Text>
            ) : (
              <InputGroup.Text
                id="phone"
                role="button"
                onClick={() => setPhoneEdit(true)}
              >
                <Pencil />
              </InputGroup.Text>
            )}
            {phoneEdit
          && (
          <InputGroup.Text role="button" onClick={() => setDefaultValue('phone', formik)}>
            <XLg className="fw-bold fs-5 text-danger" />
          </InputGroup.Text>
          )}
            <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
              {t(formik.errors.phone)}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Form>

      <Form
        onSubmit={formikPass.handleSubmit}
        className="col-xl-10 col-xxl-7 change-data"
      >
        <Form.Group className={formClass('password', formikPass)} controlId="password">
          <Form.Label className="col-12 col-xl-4 col-xxl-4">{t('signupForm.password')}</Form.Label>
          <InputGroup>
            <Form.Control
              ref={passwordRef}
              onChange={formikPass.handleChange}
              onBlur={() => {
                if (!formikPass.values.password) {
                  setDefaultValue('password', formikPass);
                }
              }}
              isInvalid={formikPass.errors.password && formikPass.submitCount}
              autoComplete="off"
              type="password"
              value={formikPass.values.password}
              name="password"
              placeholder={placeholderGen()}
              disabled={!passwordEdit}
            />
            {passwordEdit ? (
              <InputGroup.Text
                id="password"
                as="button"
                type="submit"
                disabled={formikPass.isSubmitting}
              >
                {formikPass.isSubmitting
                  ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      variant="success"
                    />
                  )
                  : <CheckLg className="fw-bold fs-4 text-success" />}
              </InputGroup.Text>
            ) : (
              <InputGroup.Text
                id="password"
                role="button"
                onClick={() => setPasswordEdit(true)}
              >
                <Pencil />
              </InputGroup.Text>
            )}
            {passwordEdit
          && (
          <InputGroup.Text role="button" onClick={() => setDefaultValue('password', formikPass)}>
            <XLg className="fw-bold fs-5 text-danger" />
          </InputGroup.Text>
          )}
            <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
              {t(formikPass.errors.password)}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        {continueChangePass && (
          <Form.Group className={formClass('confirmPassword', formikPass)} controlId="confirmPassword">
            <Form.Label className="col-12 col-xl-4 col-xxl-4">{t('signupForm.confirm')}</Form.Label>
            <InputGroup>
              <Form.Control
                onChange={formikPass.handleChange}
                onBlur={() => {
                  if (!formikPass.values.password) {
                    setDefaultValue('password', formikPass);
                  }
                }}
                isInvalid={formikPass.errors.confirmPassword && formikPass.submitCount}
                autoComplete="off"
                type="password"
                value={formikPass.values.confirmPassword}
                name="confirmPassword"
                placeholder={t('signupForm.confirm')}
              />
              <Form.Control.Feedback type="invalid" tooltip placement="right" className="anim-show">
                {t('validation.mastMatch')}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        )}
      </Form>
    </>
  );
};

export default ChangeData;
