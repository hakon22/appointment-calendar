import * as yup from 'yup';
import { setLocale } from 'yup';

setLocale({
  mixed: {
    required: () => ('validation.required'),
  },
  string: {
    min: () => ('validation.requirements'),
    max: () => ('validation.requirements'),
    length: () => ('validation.phone'),
  },
});

export default () => yup.object().shape({
  name: yup
    .string()
    .trim()
    .required()
    .min(3)
    .max(20),
  phone: yup
    .string()
    .trim()
    .required()
    .transform((value) => value.replace(/[^\d]/g, ''))
    .length(11),
});
