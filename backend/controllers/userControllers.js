const http2 = require('http2');
const User = require('../models/userScheme');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET } = process.env;

/* Получение списка пользователей */
module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(http2.constants.HTTP_STATUS_OK).send(users))
    .catch(next);
};

/* Обработчик поиска по ID */
const findUserById = (req, res, requiredData, next) => {
  User.findById(requiredData)
    .orFail()
    .then((user) => res.status(http2.constants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({message: "Пользователь с данным ID не обнаружен"});
        return
      } else if (err instanceof CastError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({message: "Некорректные данные (ID)"})
        return
      } else {
        next(err);
      }
    });
};

/* Обработчик получения пользователя */
module.exports.getUser = (req, res, next) => {
  findUserById(req, res, req.params.userId, next);
};

/* Обработка get user info */
module.exports.getUserInfo = (req, res, next) => {
  findUserById(req, res, req.user._id, next);
};

/* Обработка POST запроса /users */
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
  .then((hash) => User.create({
    name, about, avatar, email, password: hash
  }))
    .then((user) => {
      const data = user.toObject();
      delete data.password;
      res.status(http2.constants.HTTP_STATUS_OK).send({data});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
        return;
      }
      else if (err.code === 11000) {
        res.status(http2.constants.HTTP_STATUS_CONFLICT).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
        return;
      }
      else { next(err); }
    })
};

/* Обработчик апдейта данных пользователя */
const userUpdate = (req, res, updateData, next) => {
  User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(http2.constants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({message: "Пользователь с данным ID не обнаружен"});
        return
      } else if (err instanceof CastError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
        return
      } else if (err instanceof ValidationError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
        return
      } else {
        next(err);
      }
    });
};

/* Обработчик апдейта информации пользователя */
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  userUpdate(req, res, { name, about }, next);
};

/* Апдейт аватара пользователя */
module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userUpdate(req, res, { avatar }, next);
};

/* Авторизация */
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'token-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.status(http2.constants.HTTP_STATUS_OK).send({ message: 'Успешный вход' });
    })
    .catch(next);
};

/* Выход из учётной записи */
module.exports.logout = (req, res) => {
  res.cookie('jwt', 'none', {
    maxAge: 5000,
    httpOnly: true,
    sameSite: true,
  });
  res.status(http2.constants.HTTP_STATUS_OK).send({ message: 'Успешный выход' });
};