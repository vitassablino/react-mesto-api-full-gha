class Api {
  constructor(data) {
    this._url = data.url;
    this._headers = data.headers;
  }

  #checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  /* Получение стартовых данных о профиле */
  getUserData() {
    return fetch(this._url + "/users/me", {
      method: "GET",
      headers: this._headers,
    }).then(this.#checkResponse);
  }

  setUserData(data) {
    console.log(data);
    return fetch(this._url + "/users/me", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then(this.#checkResponse);
  }

  /* Получение ствртовых каточек */
  getInitialCards() {
    return fetch(this._url + "/cards", {
      method: "GET",
      headers: this._headers,
    }).then(this.#checkResponse);
  }

  /* Получение данные */
  getData() {
    return Promise.all([this.getInitialCards(), this.getUserData()]);
  }

  /*установка лайка*/
  like(id) {
    return fetch(this._url + `/cards/${id}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then(this.#checkResponse);
  }

  /* снятие лайка */
  notLike(id) {
    return fetch(this._url + `/cards/${id}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this.#checkResponse);
  }

  changeLike(id, isLiked) {
    if (isLiked) {
      return this.notLike(id);
    } else {
      return this.like(id);
    }
  }

  addNewCard(items) {
    console.log(items);
    return fetch(this._url + "/cards", {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: items.cardName,
        link: items.cardLink,
      }),
    }).then(this.#checkResponse);
  }

  delete(id) {
    return fetch(this._url + `/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this.#checkResponse);
  }

  editAvatar(items) {
    return fetch(this._url + "/users/me/avatar", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: items.avatar,
      }),
    }).then(this.#checkResponse);
  }
}

const apiData = {
  url: "https://mesto.nomoreparties.co/v1/cohort-59",
  headers: {
    authorization: "44c0c0c8-2249-4c66-a825-6f516eb82eac",
    "Content-Type": "application/json",
  },
};

const api = new Api(apiData);
export default api;
