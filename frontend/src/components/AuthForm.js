import { useState } from "react";

function AuthForm({ title, btnText, handleSubmit, children }) {
  const [values, setValues] = useState({ password: "", email: "" });

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setValues((oldValues) => ({ ...oldValues, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    handleSubmit(values);
  };

  return (
    <section className="auth-form">
      <h2 className="auth-form__title">{title}</h2>
      <form onSubmit={handleSubmitForm}>
        <label className="auth-form__input-wrapper">
          <input
            type="email"
            name="email"
            className="auth-form__input"
            placeholder="Email"
            onChange={handleChange}
            required
            value={values["email"] ?? ""}
          />
          <span className="auth-form__input-error"></span>
        </label>

        <label className="auth-form__input-wrapper">
          <input
            type="password"
            name="password"
            className="auth-form__input"
            placeholder="Пароль"
            minLength="4"
            maxLength="30"
            onChange={handleChange}
            required
            value={values["password"] ?? ""}
          />
          <span className="auth-form__input-error"></span>
        </label>

        <button type="submit" className="auth-form__submit-btn">
          {btnText}
        </button>
      </form>
      {children}
    </section>
  );
}

export default AuthForm;
