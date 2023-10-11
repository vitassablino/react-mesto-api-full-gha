import { Link } from "react-router-dom";
import Form from "./Form";

export default function AuthScreen({
  name,
  title,
  buttonText,
  onSubmit,
  isFormValid,
  ...props
}) {
  return (
    <section className="authorization">
      <div className="authorization__wrapper">
        <h2 className="authorization__title">{title}</h2>
        <Form
          name={name}
          buttonText={buttonText}
          onSubmit={onSubmit}
          isFormValid={isFormValid}
        >
          {props.children}
        </Form>
        {name === "registr" && (
          <p className="authorization__text">
            Уже зарегистрированы?{" "}
            <Link
              to="/sign-in"
              className="authorization__text authorization__link"
            >
              Войти
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

