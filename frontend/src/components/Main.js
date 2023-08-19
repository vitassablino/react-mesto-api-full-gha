import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Card from "./Card.js";

function Main(props) {
  const userData = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile container">
        <div className="profile__container">
          <div className="profile__avatar-container">
            <img
              className="profile__avatar"
              src={userData.avatar}
              alt={`Аватарка ${userData.name}`}
            />
            <div
              className="profile__avatar-button"
              onClick={() => props.onEditAvatar(true)}
            ></div>
          </div>
          <div className="profile__info">
            <h1 className="profile__name">{userData.name}</h1>
            <button
              aria-label="Редактировать профиль"
              className="profile__edit-button"
              type="button"
              onClick={() => props.onEditProfile(true)}
            ></button>
            <p className="profile__description">{userData.about}</p>
          </div>
        </div>
        <button
          aria-label="Добавить место"
          className="profile__add-button"
          type="button"
          onClick={() => props.onAddPlace(true)}
        ></button>
      </section>

      {
        <ul className="elements">
          {props.cards.map((card) => (
            <Card
              key={card._id}
              id={card._id}
              ownerId={card.owner._id}
              link={card.link}
              name={card.name}
              likes={[...card.likes]}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          ))}
        </ul>
      }
    </main>
  );
}

export default Main;
