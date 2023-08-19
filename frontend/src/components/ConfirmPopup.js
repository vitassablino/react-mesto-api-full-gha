import React from "react";

import PopupWithForm from "./PopupWithForm";

function ConfirmPopup({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  buttonText,
}) {
  function handleSubmit(evt) {
    evt.preventDefault();

    onConfirm();
  }

  return (
    <PopupWithForm
      name="popup_deleting-confirm"
      title={title}
      buttonText={buttonText}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isOk={true}
      toDoText={"Удалить"}
      ongoingText={"Удаление"}
    >
      {/* <button
        type="submit"
        className={`popup-form__save-button ${
          isLoading ? "popup-form__save-button_disabled" : ""
        }`}
        disabled={isLoading ? true : false}
      >
        {isLoading ? "Удаление..." : "Удалить"}
      </button> */}
    </PopupWithForm>
  );
}

export default ConfirmPopup;
