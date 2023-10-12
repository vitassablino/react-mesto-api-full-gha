const http2 = require('http2');
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const { LINK_REGEXP } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (correct) => LINK_REGEXP.test(correct),
      message: 'Неправильный формат ссылки',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (correct) => isEmail(correct),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false,

  statics: {
    findUserByCredentials(email, password, res) {
      return this.findOne({ email }).select('+password')
        .then((user) => {
          if (!user) {
            res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({ message: 'Неверный логин или пароль' });
          }

          return bcrypt.compare(password, user.password)
            .then((matched) => {
              if (!matched) {
                res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({ message: 'Неверный логин или пароль' });
              }

              return user;
            });
        });
    },
  },
});

module.exports = mongoose.model('user', userSchema);
