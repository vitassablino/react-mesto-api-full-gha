import { useEffect, useContext } from "react";
import useValidation from "../utils/useValidation";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";


export default function EditProfilePopup({
  isOpen,
  onClose,
  onUpdateUser,
  onLoading,
  onOverlayClick,
}) {

  const { values, errors, isFormValid, onChange, resetValidation } = useValidation();
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    resetValidation(true, currentUser);
  }, [currentUser, isOpen, resetValidation]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser(values);
  }
  return (
    <PopupWithForm
      name="edit-profile"
      title="Редактировать профиль"
      buttonText={onLoading ? "Сохранение..." : "Сохранить"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isFormValid={isFormValid}
      onOverlayClick={onOverlayClick}
    >
      <label className="form__input-wrapper">
        <input
          type="text"
          name="name"
          form="edit-profile"
          required
          placeholder="Введите ваше имя"
          minLength="2"
          maxLength="40"
          className={`form__input ${
            errors.name ? "form__input_type_error" : ""
          }`}
          id="name-input"
          onChange={onChange}
          value={values.name || ""}
        />
        <span
          className={`form__input-error ${
            errors.name ? "form__input-error_active" : ""
          }`}
        >
          {errors.name || ""}
        </span>
      </label>
      <label className="form__input-wrapper">
        <input
          type="text"
          name="about"
          form="edit-profile"
          required
          placeholder="Опишите кто вы"
          minLength="2"
          maxLength="200"
          className={`form__input ${
            errors.about ? "form__input_type_error" : ""
          }`}
          id="about-input"
          onChange={onChange}
          value={values.about || ""}
        />
        <span
          className={`form__input-error ${
            errors.about ? "form__input-error_active" : ""
          }`}
        >
          {errors.about || ""}
        </span>
      </label>
    </PopupWithForm>
  );
}