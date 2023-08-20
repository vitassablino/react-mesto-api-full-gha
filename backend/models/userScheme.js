const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const http2 = require('http2');

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (correct) => validator.isURL(correct),
      message: 'Некорректный адрес',
    },
  },
  email: {
    type: String,
    minlength: 4,
    maxlength: 50,
    validate: {
      validator: (correct) => validator.isEmail(correct),
      message: 'Введённая почта не найдена',
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, //по умолчанию хеш пароля пользователя не будет возвращаться из базы
    validate: {
      validator(v) {
        return validator.isStrongPassword(v);
      },
      message: (props) => `${props.value} не является надежным паролем`,
    },
  }
});

userScheme.statics.findUserByCredentials = function (email, password, res) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        res.status(/* http2.constants.HTTP_STATUS_UNAUTHORIZED */'401').send({message: 'Неверный логин или пароль'})
      }

      return bcrypt.compare(password, user.password, res)
        .then((matched) => {
          if (!matched) {
            res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({message: 'Неверный логин или пароль'})
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userScheme);