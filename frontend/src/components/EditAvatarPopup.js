import { useFormValidation } from "../utils/useFormValidation";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
  const {
    values,
    errors,
    isValid,
    handleChange,
    resetValues,
    formRef,
    errorClassName,
  } = useFormValidation();

  function handleSubmit(evt) {
    evt.preventDefault();

    onUpdateAvatar({
      avatar: values["profileAvatarLink"],
    });

    resetValues();
  }

  return (
    <PopupWithForm
      ref={formRef}
      name="popup-avatar-edit"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isOk={isValid}
      toDoText="Сохранить"
      ongoingText="Сохранение..."
    >
      <label className="popup__input-wrapper">
        <input
          type="url"
          id="avatar"
          name="profileAvatarLink"
          className="popup-form__input"
          placeholder="Ссылка на изображение"
          value={values["profileAvatarLink"] ?? ""}
          onChange={handleChange}
          required
        />
        <span className={errorClassName("profileAvatarLink")} id="avatar-error">
          {errors["profileAvatarLink"]}
        </span>
      </label>
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

export default EditAvatarPopup;
