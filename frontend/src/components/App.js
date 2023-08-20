import { useCallback, useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Navigate, useNavigate, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ProtectedRouteElement from "./ProtectedRoute";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

import * as api from "../utils/Api";

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

  /* Получение данных с сервера */
  useEffect(() => {
    loggedIn &&
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userData, cardsData]) => {
          setCurrentUser(userData);
          setCards(cardsData.reverse());
        })
        .catch((err) => {
          console.log(err);
        });
  }, [loggedIn]);

  /* Клик по аватарке => открытие попапа редактирования аватара */
  const handleEditAvatarClick = useCallback(() => {
    setIsEditAvatarPopupOpen(true);
  }, []);

  /* Клик по редактированию профиля => открытие попапа редактирования профиля */
  const handleEditProfileClick = useCallback(() => {
    setIsEditProfilePopupOpen(true);
  }, []);

  /* КОбработчик открытия попапа добавления карточки */
  const handleAddCardSubmit = useCallback(() => {
    setIsAddCardPopupOpen(true);
  }, []);

  /* Обработчик удаления карточки */
  const handleDeleteClick = useCallback((card) => {
    console.log(card);
    setCardToDelete(card);
  }, []);

  /* Обработчик клика по карточке */
  const handleCardClick = useCallback((card) => {
    setSelectedCard(card);
  }, []);

  /* Обработчик закрытия мод.окон */
  const closeAllPopups = useCallback(() => {
    allSetsPopupOpen.forEach((item) => item(false));
    setSelectedCard({ name: "", link: "" });
    setCardToDelete(null);
    setIsLoading(false);
  }, []);

  /* Обработчик переключения бургенр-меню*/
  const handleToggleBurger = useCallback(() => {
    setIsOpenBurger(!isOpenBurger);
  }, []);

   /* Фнункция лайка */
   const handleCardLike = useCallback (
    async (card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    try {
      const data = await api.changeLikeCardStatus(card._id, isLiked);
      if (data) {
        setCards((state) =>
          state.map((item) => (item._id === card._id ? data : item))
        );
      }
    } catch (err) {
      console.log(err);
    }
  },
  [currentUser._id] );

  /* Обработчик удаления карточки */
  const handleCardDelete = useCallback(
    async (card) => {
      setIsLoading(true);
      try {
        const data = await api.deleteCard(card._id);
        if (data) {
          setCards((state) => state.filter((item) => item._id !== card._id));
          closeAllPopups();
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
    [closeAllPopups]
  );

  /* Обработчик обновления пользователя */
  const handleUpdateUser = useCallback(
    async (userData) => {
      setIsLoading(true);
      try {
        const data = await api.setUserInfo(userData);
        if (data) {
          setCurrentUser(data);
          closeAllPopups();
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
    [closeAllPopups]
  );

    /* Обработчик обновления аватара */
    const handleUpdateAvatar = useCallback(
      async (avatarData) => {
        setIsLoading(true);
        try {
          const data = await api.setUserAvatar(avatarData);
          if (data) {
            setCurrentUser(data);
            closeAllPopups();
          }
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      },
      [closeAllPopups]
    );

  /* Обработчик добавления карточки */
  const handleAddPlaceSubmit = useCallback(
    async (cardData) => {
      setIsLoading(true);
      try {
        const data = await api.sendNewCardInfo(cardData);
        if (data) {
          setCards([data, ...cards]);
          closeAllPopups();
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
    [cards, closeAllPopups]
  );

  /* Обработчик регистрации */
  const handleRegistrationUser = useCallback(
    async (userData) => {
      setIsLoading(true);
      try {
        const data = await api.register(userData);
        if (data) {
          setIsInfoTooltipOpen({ isOpen: true, status: true });
          navigate("/sign-in", { replace: true });
        }
      } catch (err) {
        console.error(err);
        setIsInfoTooltipOpen({ isOpen: true, status: false });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  /* Обработчик авторизации пользователя */
   const handleAuthorizationUser = useCallback(
    async (userData) => {
      setIsLoading(true);
      try {
        const data = await api.authorize(userData);
        if (data) {
          setLoggedIn(true);
          setUserEmail(userData.email);
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error(err);
        setIsInfoTooltipOpen({ isOpen: true, status: false });
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );
  
 /* Проверка авторизации */
  const userLoginCheck = useCallback(async () => {
    try {
      const userData = await api.getContent();
      if (!userData) {
        throw new Error("Данные пользователя отсутствует");
      }
      setUserEmail(userData.email);
      setLoggedIn(true);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }}, [navigate]);

  /* Обработчик выхода из учётной записи */
  const handleUserLogOut = useCallback(async () => {
    try {
      const data = await api.logout();
      if (data) {
        setLoggedIn(false);
        setUserEmail("");
        setIsOpenBurger(false);
        navigate("/sign-in", { replace: true });
      }
    } catch (err) {
      console.error(err);
    }
  }, [navigate]);

   useEffect(() => {
    userLoginCheck();
  }, [userLoginCheck]);


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header
            userEmail={userEmail}
            onSignOut={handleUserLogOut}
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
            onConfirm={handleCardDelete}
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
