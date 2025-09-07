const VALIDATOR_TYPE_MINLENGTH = 'MINLENGTH';
const VALIDATOR_TYPE_REQUIRED = 'REQUIRED';
const VALIDATOR_TYPE_EMAIL = 'EMAIL';

export const VALIDATOR_MINLENGTH = (value) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  value: value,
});

export const VALIDATOR_REQUIRED = () => ({ type: VALIDATOR_TYPE_REQUIRED });

export const VALIDATOR_EMAIL = () => ({ type: VALIDATOR_TYPE_EMAIL });

export const validate = (value, validator) => {
  let isValid = true;
  if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
    isValid = isValid && value.trim().length >= validator.value;
  }

  if (validator.type === VALIDATOR_TYPE_REQUIRED) {
    isValid = isValid && value.trim().length > 0;
  }

  if (validator.type === VALIDATOR_TYPE_EMAIL) {
    isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
  }

  return isValid;
};
