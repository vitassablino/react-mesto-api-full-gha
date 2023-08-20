const BASE_URL = "https://api.mesto.frontend.akula.nomoreparties.co"

/* Запрос серверу */
function makeRequest(url, method, body) {
  const headers = { "Content-Type": "application/json" };
  const config = { method, headers, credentials: "include" };
  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }
  return fetch(`${BASE_URL}${url}`, config).then((res) => {
    return res.ok
      ? res.json()
      : Promise.reject(`Ошибка: ${res.status} ${res.statusText}`);
  });
}

/* Регистрация пользователя */
export function register({ password, email }) {
  return makeRequest("/signup", "POST", { password, email });
}

/* Авторизация пользователя */
export function authorize({ password, email }) {
  return makeRequest("/signin", "POST", { password, email });
}

/* Выход из учётной записи */
export function logout() {
  return makeRequest("/users/me", "DELETE");
}
 /* Получение данных пользователя с сервера */
 export function getContent() {
  return makeRequest("/users/me", "GET");
}

 /* Получение ифнормации о пользователе с сервера */
 export function getUserInfo() {
  return makeRequest("/users/me", "GET");
}

/* Отправить информацию о пользователе на сервер */
export function setUserInfo({ name, about }) {
  return makeRequest("/users/me", "PATCH", { name, about });
}

/* Отправить данные об аватарке на сервер */
export function setUserAvatar({ avatar }) {
  return makeRequest("/users/me/avatar", "PATCH", { avatar });
}

/* Получение стартовых карточек */
export function getInitialCards() {
  return makeRequest("/cards", "GET");
}

/* Отпрвить данные о новой карточке */
export function sendNewCardInfo({ name, link }) {
  return makeRequest("/cards", "POST", { name, link });
}

/* Отправить на сервер запрос на удаление карточки */
export function deleteCard(id) {
  return makeRequest(`/cards/${id}`, "DELETE");
}

/* Изменить лайк/анлайк */
export function changeLikeCardStatus(id, isLiked) {
  let method;
  isLiked ? (method = "DELETE") : (method = "PUT");
  return makeRequest(`/cards/${id}/likes`, method);
}
