import { useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Navigate, useNavigate, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ProtectedRouteElement from "./ProtectedRoute";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

import api from "../utils/Api";
import auth from "../utils/auth";

import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddCardPopup from "./AddCardPopup";
import ConfirmPopup from "./ConfirmPopup";
import ImagePopup from "./ImagePopup";
import InfoTooltip from "./InfoTooltip";

function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenBurger, setIsOpenBurger] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ name: "", link: "" });
  const [cardToDelete, setCardToDelete] = useState(null);
  const allSetsPopupOpen = [
    setIsEditAvatarPopupOpen,
    setIsEditProfilePopupOpen,
    setIsAddCardPopupOpen,
    setIsInfoTooltipOpen,
  ];
  const [cards, setCards] = useState([]);

  /* Проверка jwt и установка соотв.-их стейтов */
  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      auth
        .checkValidityUser(localStorage.getItem("jwt"))
        .then(({ data }) => {
          setLoggedIn(true);
          setUserEmail(data.email);
        })
        .then(() => navigate("/", { replace: true }))
        .catch((err) => console.log(err));
    }
  }, []);

  /* Функция выхода */
  function handleSignOut() {
    localStorage.clear("jwt");
    setLoggedIn(false);
    navigate("/signin", { replace: true });
  }

  /* Функция переключения бургенр-меню*/
  function handleToggleBurger() {
    setIsOpenBurger(!isOpenBurger);
  }

  /* получение данныъ пользователя и карточек */
  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserData(), api.getInitialCards()])
        .then((res) => {
          const [userData, cardsArray] = res;
          setCards(cardsArray);
          setCurrentUser(userData);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  /* Функция закрытия мод.окон */
  function closeAllPopups() {
    allSetsPopupOpen.forEach((item) => item(false));
    setSelectedCard({ name: "", link: "" });
    setCardToDelete(null);
    setIsLoading(false);
  }

  /* Фнункция обновления аватарки */
  function handleUpdateAvatar(avatarData) {
    setIsLoading(true);
    api
      .editAvatar(avatarData)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  /* Функция обновления информации о пользователе */
  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .setUserData(data)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  /* Фнункция добавления места аватарки */
  function handleAddCardSubmit(cardData) {
    setIsLoading(true);
    api
      .addNewCard(cardData)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  /* Фнункция выбора карточки */
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  /* Фнункция лайка */
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    console.log(card.id);

    api
      .changeLike(card.id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card.id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  /*Функция удаления карточки */
  function handleCardDelete(cardId) {
    console.log(cardId);
    setCardToDelete(cardId);
  }

  /*Функция подтверждения удаления карточки */
  function handleConfirmBeforeDelete() {
    setIsLoading(true);
    api
      .delete(cardToDelete)
      .then(() => {
        setCards(cards.filter((c) => c._id !== cardToDelete));
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  /* Функция регистрации */
  function handleRegistrationUser(userData) {
    auth
      .getRegistrationUser(userData)
      .then((data) => {
        navigate("/signin");
        setUserEmail(data.email);
        isInfoTooltipOpen({ isOpen: true, status: true });
      })
      .catch(() => setIsInfoTooltipOpen({ isOpen: true, status: false }));
  }

  /* Функция авторизации */
  function handleAuthorizationUser(userData) {
    auth
      .getAuthorizationUser(userData)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setLoggedIn(true);
          setUserEmail(userData.email);
          navigate("/");
        }
      })
      .catch(() => setIsInfoTooltipOpen({ isOpen: true, status: false }));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header
            userEmail={userEmail}
            onSignOut={handleSignOut}
            isOpenBurger={isOpenBurger}
            onToggleBurger={handleToggleBurger}
          />

          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRouteElement
                  element={Main}
                  loggedIn={loggedIn}
                  onEditProfile={setIsEditProfilePopupOpen} // редактирование профиля
                  onAddPlace={setIsAddCardPopupOpen} // добавление карточки
                  onEditAvatar={setIsEditAvatarPopupOpen} // редактирование аватара
                  onCardClick={handleCardClick} // нажатие на карточку
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete} // удаление карточки
                />
              }
            />

            <Route
              path="/signin"
              element={
                <Login
                  setUserEmail={setUserEmail}
                  setLoggedIn={setLoggedIn}
                  navigate={navigate}
                  onInfoTooltipOpen={setIsInfoTooltipOpen}
                  handleAuthorizationUser={handleAuthorizationUser}
                />
              }
            ></Route>

            <Route
              path="/signup"
              element={
                <Register
                  setUserEmail={setUserEmail}
                  navigate={navigate}
                  onInfoTooltipOpen={setIsInfoTooltipOpen}
                  handleRegistrationUser={handleRegistrationUser}
                />
              }
            ></Route>
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Routes>

          {loggedIn && <Footer />}

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />

          <AddCardPopup
            isOpen={isAddCardPopupOpen}
            onClose={closeAllPopups}
            onAddCard={handleAddCardSubmit}
            isLoading={isLoading}
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />

          <ConfirmPopup
            isOpen={cardToDelete}
            onClose={closeAllPopups}
            onConfirm={handleConfirmBeforeDelete}
            title="Вы уверены?"
            buttonText="Да"
          />

          <InfoTooltip
            onClose={closeAllPopups}
            /* handleRegistrationUser={handleRegistrationUser} */
            isOpenConfig={isInfoTooltipOpen}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
