const authSetting = {
  url: "https://api.mesto.frontend.akula.nomoreparties.co"
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

  getRegistrationUser(data) {
 console.log("метод getRegistrationUser запустился");

    return fetch(`${this._url}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: data.password,
        email: data.email,
      }),
    }).then(this.#checkResponse);
  }

  getAuthorizationUser(data) {
    //console.log(data);
    return fetch(`${this._url}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //credentials: 'include',
      body: JSON.stringify({
        password: data.password,
        email: data.email,
      }),
    }).then(this.#checkResponse)
    .then((data) => {
      if (data.token) {
        const { token } = data;
        localStorage.setItem('jwt', token);
        return token;
      };
    });
  }

  getContent(token) {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      //credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(this.#checkResponse)
    .then(data => data);
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
