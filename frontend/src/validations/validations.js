import * as yup from 'yup';
import { setLocale } from 'yup';

setLocale({
  mixed: {
    required: () => ('validation.required'),
    notOneOf: () => ('validation.uniq'),
  },
  string: {
    min: () => ('validation.requirements'),
    max: () => ('validation.requirements'),
    length: () => ('validation.phone'),
    email: () => ('validation.email'),
  },
});

export const loginValidation = yup.object().shape({
  email: yup
    .string()
    .email()
    .trim()
    .required(),
  password: yup
    .string()
    .trim()
    .required(),
});

export const signupValidation = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required()
    .min(3)
    .max(20),
  email: yup
    .string()
    .email()
    .trim()
    .required(),
  phone: yup
    .string()
    .trim()
    .required()
    .transform((value) => value.replace(/[^\d]/g, ''))
    .length(11),
  password: yup
    .string()
    .trim()
    .required()
    .min(6, 'validation.passMin'),
  confirmPassword: yup
    .string()
    .test('confirmPassword', (value, context) => value === context.parent.password),
});

export const settingsValidation = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required()
    .min(3)
    .max(20),
  email: yup
    .string()
    .email()
    .trim()
    .required(),
  phone: yup
    .string()
    .trim()
    .required()
    .transform((value) => value.replace(/[^\d]/g, ''))
    .length(11),
});

export const passwordsValidation = yup.object().shape({
  password: yup
    .string()
    .trim()
    .required()
    .min(6, 'validation.passMin'),
});

export const continuePasswordValidation = yup.object().shape({
  password: yup
    .string()
    .trim()
    .required()
    .min(6, 'validation.passMin'),
  confirmPassword: yup
    .string()
    .test('confirmPassword', (value, context) => value === context.parent.password),
});

export const emailValidation = yup.object().shape({
  email: yup
    .string()
    .email()
    .trim()
    .required(),
});

export const timeValidation = yup.object().shape({
  time: yup
    .string()
    .required(),
});

export const activationValidation = yup.object().shape({
  code: yup
    .string()
    .required()
    .transform((value) => value.replace(/[^\d]/g, ''))
    .test('code', 'Введите 4 цифры', (value) => value.length === 4),
});
