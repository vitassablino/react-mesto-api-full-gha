function ImagePopup({ card, onClose }) {
  return (
    <div
      className={`popup image-container ${card.link ? "popup_active" : ""}`}
      /* className={`popup image-container ${
        props.card && props.isOpen ? "popup_active" : {}
      }`} */
      id="image-container"
      onClick={({ target }) => {
        if (
          target.classList.contains("popup_active") ||
          target.classList.contains("popup__close-button")
        ) {
          onClose();
        }
      }}
    >
      <div className="popup__figure-position" id="figure-position ">
        <figure className="image-figure">
          <img
            className="image-figure__big-image"
            alt={`Фотография ${card.name}`}
            src={card.link}
          />
          <figcaption className="image-figure__figcaption">
            {card.name}
          </figcaption>
        </figure>
        <button
          className="popup__close-button"
          aria-label="Закрыть изображение"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default ImagePopup;
