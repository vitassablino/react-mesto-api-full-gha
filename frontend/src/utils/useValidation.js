import { useCallback, useState } from "react";

/* Функция валидации полей ввода */
function useValidation() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isFormValid, setFormValid] = useState(false);
  function onChange(e) {
    const { name, value } = e.target;
    const error = e.target.validationMessage;
    const formValid = e.target.closest("form").checkValidity();
    setValues((values) => ({ ...values, [name]: value }));
    setErrors((errors) => ({ ...errors, [name]: error }));
    setFormValid(formValid);
  }
  const resetValidation = useCallback(
    (isFormValid = false, values = {}, errors = {}) => {
      setFormValid(isFormValid);
      setValues(values);
      setErrors(errors);
    },
    [setFormValid, setValues, setErrors]
  );
  return {
    values,
    errors,
    isFormValid,
    onChange,
    resetValidation,
  };
}

export default useValidation;
