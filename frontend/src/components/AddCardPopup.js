import React from "react";
import PopupWithForm from "./PopupWithForm";
import { useFormValidation } from "../utils/useFormValidation";

function AddCardPopup({ isOpen, onClose, onAddCard, isLoading }) {
  const {
    values,
    errors,
    isValid,
    handleChange,
    resetValues,
    formRef,
    errorClassName,
  } = useFormValidation();

  function handleSubmit(e) {
    e.preventDefault();

    onAddCard({
      cardName: values["cardName"],
      cardLink: values["cardLink"],
    });

    resetValues();
  }

  return (
    <PopupWithForm
      ref={formRef}
      name="card-popup"
      title="Новое место"
      buttonText="Создать"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isOk={isValid}
      toDoText="Добавить"
      ongoingText="Добавление"
    >
      <input
        className="popup-form__input"
        type="text"
        name="cardName"
        autoComplete="off"
        placeholder="Название"
        id="cardName"
        minLength="2"
        maxLength="30"
        required
        onChange={handleChange}
        value={values["cardName"] ?? ""}
      />
      <span className={errorClassName("cardName")}>{errors["cardName"]}</span>
      <input
        className="popup-form__input"
        type="url"
        name="cardLink"
        autoComplete="off"
        placeholder="Ссылка на картинку"
        id="cardLink"
        required
        onChange={handleChange}
        value={values["cardLink"] ?? ""}
      />
      <span className={errorClassName("cardLink")}>{errors["cardLink"]}</span>

      {/*  <button
        type="submit"
        className={`popup-form__save-button ${
          isValid ? "" : "popup-form__save-button_disabled"
        }`}
        disabled={isValid ? false : true}
      >
        {isLoading ? "Добавление..." : "Добавить"}
      </button> */}
    </PopupWithForm>
  );
}

export default AddCardPopup;
