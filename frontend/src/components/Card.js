import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(card) {
  const currentUser = useContext(CurrentUserContext),
    cardOwner = currentUser._id === card.ownerId,
    isLiked = card.likes.some((i) => i._id === currentUser._id),
    cardLikeButtonClassName = !isLiked
      ? "element__like-button"
      : "element__like-button element__like-button_active";

  function handleClick() {
    card.onCardClick(card);
  }

  function handleLikeClick() {
    card.onCardLike(card);
  }

  function handleDeleteClick() {
    console.log(card.id);
    card.onCardDelete(card.id);
  }

  return (
    <li className="element">
      <div className="element__pic-cintainer">
        <img
          className="element__image"
          alt={card.name}
          onClick={handleClick}
          src={card.link}
        />
      </div>
      <div className="element__form">
        <h2 className="element__label">{card.name}</h2>
        <div className="element__like-container">
          <button
            aria-label="Лайк"
            className={cardLikeButtonClassName}
            type="button"
            onClick={handleLikeClick}
          ></button>
          <p className="element__like-counter">{card.likes.length}</p>
        </div>
      </div>
      {cardOwner && (
        <button
          aria-label="Удалить место"
          className="element__delete"
          type="button"
          onClick={handleDeleteClick}
        ></button>
      )}
    </li>
  );
}

export default Card;
