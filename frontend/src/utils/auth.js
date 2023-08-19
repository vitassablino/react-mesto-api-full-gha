const authSetting = {
  url: "https://api.mesto.frontend.akula.nomoreparties.co",
  headers: {
    "Content-Type": "application/json",
  },
};

class Auth {
  constructor(options) {
    this._url = options.url;
    this._headers = options.headers;
  }

  #checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getRegistrationUser({ password, email }) {
// console.log(password, email);

    return fetch(`${this._url}/signup`, {
      method: "POST",
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    }).then(this.#checkResponse);
  }

  getAuthorizationUser({ password, email }) {
    return fetch(`${this._url}/signin`, {
      method: "POST",
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    }).then(this.#checkResponse);
  }

  checkValidityUser(jwt) {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      credentials: 'include',
    }).then(this.#checkResponse);
  }
}

const auth = new Auth(authSetting);

export default auth;
