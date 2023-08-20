const authSetting = {
  url: "https://mesto.frontend.akula.nomoreparties.co",
};

class Auth {
  constructor(options) {
    this._url = options.url;
  }

  #checkResponse(res) {
    if (res.ok) {
      return res.json();      
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getRegistrationUser({ password, email }) {
 //console.log(password, email);

    return fetch(`${this._url}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        email: email,
      }),
     /*  mode: 'no-cors', */
    }).then(this.#checkResponse);
  }

  getAuthorizationUser(data) {
    //console.log(data);
    return fetch(`${this._url}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        password: data.password,
        email: data.email,
      }),
    }).then(this.#checkResponse)
    .then((data) => {
      localStorage.setItem('jwt', data.token)
      return data;
    });
  }

  getContent() {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      credentials: 'include',  
    }).then(this.#checkResponse);
  };
  
/*   checkValidityUser(jwt) {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      credentials: 'include',
    }).then(this.#checkResponse);
  } */
}

const auth = new Auth(authSetting);

export default auth;
