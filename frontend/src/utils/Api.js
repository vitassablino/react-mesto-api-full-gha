const BASE_URL = "https://api.mesto.frontend.akula.nomoreparties.co";

/* Запрос на сервер */
function makeRequest(url, method, body) {
  const headers = { "Content-Type": "application/json" };
  const config = { method, headers, credentials: "include" };
  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }
  return fetch(`${BASE_URL}${url}`, config).then((res) => {
    return res.ok
      ? res.json()
      : Promise.reject(`Ошибка от api.js: ${res.status} ${res.statusText}`);
  });
}

/* Функция регистрации пользователя */
function register({ password, email }) {
  return makeRequest("/signup", "POST", { password, email });
}

/* Функция авторизации пользователя */
function authorize({ password, email }) {
  return makeRequest("/signin", "POST", { password, email });
}

/* Функция выхода пользователя */
function logout() {
  return makeRequest("/users/me", "DELETE");
}

/* Функция запроса данных */
function getContent() {
  return makeRequest("/users/me", "GET");
}

/*Функция запроса данных о пользователе */
function getUserInfo() {
  return makeRequest("/users/me", "GET");
}

/* Функция отправки данных о пользователе */
function setUserInfo({ name, about }) {
  return makeRequest("/users/me", "PATCH", { name, about });
}

/* Функция изменения аватара пользователя */
function setUserAvatar({ avatar }) {
  return makeRequest("/users/me/avatar", "PATCH", { avatar });
}

/* Функция запроса стартовых карточек */
function getInitialCards() {
  return makeRequest("/cards", "GET");
}

/* Функция отправки новой карточки */
function sendNewCardInfo({ name, link }) {
  return makeRequest("/cards", "POST", { name, link });
}

/* Функция удаления карточки */
function deleteCard(id) {
  return makeRequest(`/cards/${id}`, "DELETE");
}

/* Функция установки/снятия лайка */
function changeLikeCardStatus(id, isLiked) {
  let method;
  isLiked ? (method = "DELETE") : (method = "PUT");
  return makeRequest(`/cards/${id}/likes`, method);
}

export {
  register,
  authorize,
  logout,
  getContent,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
  getInitialCards,
  sendNewCardInfo,
  deleteCard,
  changeLikeCardStatus,
}