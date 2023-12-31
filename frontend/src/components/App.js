import { useState, useEffect, useCallback } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import Login from "./Login";
import Register from "./Register";
import Main from "./Main";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import InfoTooltip from "./InfoTooltip";
import ProtectedRouteElement from "./ProtectedRoute";
import NotFound from "./NotFound";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import * as api from "../utils/api";


function App() {

  const [isEditAvatarPopupOpen, setEditAvatarPopupClass] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupClass] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupClass] = useState(false);
  const [isDeleteCardPopupOpen, setDeleteCardPopupClass] = useState(false);
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupClass] = useState(false);
  const [isHamburgerOpen, setHamburgerClass] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [infoTooltipStatus, setInfoTooltipStatus] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

/* Получение стартовых данных */
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

/* Обработчик изменения автарки */
  const handleEditAvatarClick = useCallback(() => {
    setEditAvatarPopupClass(true);
  }, []);

/* Обпвботчик изменения данных профиля */
  const handleEditProfileClick = useCallback(() => {
    setEditProfilePopupClass(true);
  }, []);

/* Обработчик добавления карточки */
  const handleAddPlaceClick = useCallback(() => {
    setAddPlacePopupClass(true);
  }, []);
/* Обработчик удаления карточки */
  const handleDeleteClick = useCallback((card) => {
    setDeleteCardPopupClass(true);
    setCardToDelete(card);
  }, []);

/* Обработчик нажатия на карточку */
  const handleCardClick = useCallback((card) => {
    setSelectedCard(card);
  }, []);

  /* Закрытие всех попапов */
  const closeAllPopups = useCallback(() => {
    setEditAvatarPopupClass(false);
    setEditProfilePopupClass(false);
    setAddPlacePopupClass(false);
    setDeleteCardPopupClass(false);
    setInfoTooltipPopupClass(false);
    setSelectedCard(null);
    setCardToDelete({});
    setInfoTooltipStatus("");
  }, []);

 /* Обработчик клика по меню */
  const handleHamburgerClick = useCallback(() => {
    setHamburgerClass(!isHamburgerOpen);
  }, [isHamburgerOpen]);

  /* Обработчик клика по карточке */
  const handleCardLike = useCallback(
    async (card) => {
      const isLiked = card.likes.some((item) => item === currentUser._id);
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
    [currentUser._id]
  );

  /* Обработчик удаления карточки */
  const handleCardDelete = useCallback(
    async (card) => {
      setLoading(true);
      try {
        const data = await api.deleteCard(card._id);
        if (data) {
          setCards((state) => state.filter((item) => item._id !== card._id));
          closeAllPopups();
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [closeAllPopups]
  );

  /* Обработчик обновления данных пользователя */
  const handleUpdateUser = useCallback(
    async (userData) => {
      setLoading(true);
      try {
        const data = await api.setUserInfo(userData);
        if (data) {
          setCurrentUser(data);
          closeAllPopups();
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [closeAllPopups]
  );

  /* Обработчик обновления аватара */
  const handleUpdateAvatar = useCallback(
    async (avatarData) => {
      setLoading(true);
      try {
        const data = await api.setUserAvatar(avatarData);
        if (data) {
          setCurrentUser(data);
          closeAllPopups();
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [closeAllPopups]
  );

  /* Обработчик добавления картчоки */
  const handleAddPlaceSubmit = useCallback(
    async (cardData) => {
      setLoading(true);
      try {
        const data = await api.sendNewCardInfo(cardData);
        if (data) {
          setCards([data, ...cards]);
          closeAllPopups();
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [cards, closeAllPopups]
  );

  /* Обрабочтик регистрации пользователя */
  const handleUserRegistration = useCallback(
    async (userData) => {
      setLoading(true);
      try {
        const data = await api.register(userData);
        if (data) {
          setInfoTooltipStatus("success");
          setInfoTooltipPopupClass(true);
          navigate("/sign-in", { replace: true });
        }
      } catch (err) {
        console.error(err);
        setInfoTooltipStatus("fail");
        setInfoTooltipPopupClass(true);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );
 
  /* обработчик авторизации  */
  const handleUserAuthorization = useCallback(
    async (userData) => {
      setLoading(true);
      try {
        const data = await api.authorize(userData);
        if (data) {
          setLoggedIn(true);
          setUserEmail(userData.email);
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error(err);
        setInfoTooltipStatus("fail");
        setInfoTooltipPopupClass(true);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  /* обработчик логина */
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

  /* Обработчик выхода пользователя */
  const handleUserLogOut = useCallback(async () => {
    try {
      const data = await api.logout();
      if (data) {
        setLoggedIn(false);
        setUserEmail("");
        setHamburgerClass(false);
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
    <div className="page__content">
      <CurrentUserContext.Provider value={currentUser}>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout
                email={userEmail}
                isOpen={isHamburgerOpen}
                onHamburgerClick={handleHamburgerClick}
                onLogOut={handleUserLogOut}
              />
            }
          >
            <Route
              index
              element={
                <ProtectedRouteElement
                  element={Main}
                  cards={cards}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleDeleteClick}
                  loggedIn={loggedIn}
                />
              }
            />
            <Route
              path="/sign-in"
              element={
                <Login
                  onLogin={handleUserAuthorization}
                  onLoading={isLoading}
                />
              }
            />
            <Route
              path="/sign-up"
              element={
                <Register
                  onRegistr={handleUserRegistration}
                  onLoading={isLoading}
                />
              }
            />
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onLoading={isLoading}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          onLoading={isLoading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          onLoading={isLoading}
        />
        <DeleteCardPopup
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
          onDeleteCard={handleCardDelete}
          onLoading={isLoading}
          card={cardToDelete}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          status={infoTooltipStatus}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
