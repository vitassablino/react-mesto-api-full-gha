import { useContext, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useFormValidation } from "../utils/useFormValidation";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const {
      values,
      errors,
      isValid,
      handleChange,
      resetValues,
      setValue,
      formRef,
      errorClassName,
    } = useFormValidation(),
    currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    if (currentUser) {
      setValue("name", currentUser.name);
      setValue("about", currentUser.about);
    }
  }, [currentUser, setValue]);

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser({
      name: values["name"],
      about: values["about"],
    });
    console.log(values["name"], values["about"]);
  }

  const onClosePopup = () => {
    onClose();
    resetValues({
      name: currentUser.name,
      about: currentUser.about,
    });
  };

  return (
    <PopupWithForm
      ref={formRef}
      name="edit-popup"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClosePopup}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isOk={isValid}
      toDoText="Сохранить"
      ongoingText="Сохранение..."
    >
      <input
        className="popup-form__input"
        type="text"
        name="name"
        autoComplete="off"
        placeholder="Имя"
        id="name"
        minLength="3"
        maxLength="40"
        value={values["name"] ?? ""}
        required
        onChange={handleChange}
      />
      <span className={errorClassName("name")}>{errors["name"]}</span>
      <input
        className="popup-form__input"
        type="text"
        name="about"
        autoComplete="off"
        placeholder="Описание"
        id="description"
        minLength="3"
        maxLength="200"
        value={values["about"] ?? ""}
        required
        onChange={handleChange}
      />
      <span className={errorClassName("about")}>{errors["about"]}</span>
      {/* <button
        type="submit"
        className={`popup-form__save-button ${
          isValid ? "" : "popup-form__save-button_disabled"
        }`}
        disabled={isValid ? false : true}
      >
        {isLoading ? "Сохранение..." : "Сохранить"}
      </button> */}
    </PopupWithForm>
  );
}

export default EditProfilePopup;
