import iconDone from "../images/icon-ok.svg";
import iconError from "../images/icon-error.svg";

function InfoTooltip({ isOpenConfig, onClose }) {
  return (
    <section
      className={`infoTooltip ${
        isOpenConfig.isOpen ? "infoTooltip_opened" : ""
      }`}
      onClick={({ target }) => {
        if (
          target.classList.contains("infoTooltip_opened") ||
          target.classList.contains("infoTooltip__close")
        ) {
          onClose();
        }
      }}
    >
      <div className="infoTooltip__container">
        <button
          type="button"
          onClick={onClose}
          className="infoTooltip__close"
        />
        <img
          src={isOpenConfig.status ? iconDone : iconError}
          className="infoTooltip__img"
          alt=""
        ></img>
        <p className="infoTooltip__text">
          {isOpenConfig.status
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте ещё раз."}
        </p>
      </div>
    </section>
  );
}

export default InfoTooltip;
