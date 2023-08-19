const rateLimit = require('express-rate-limit');
const { errors, celebrate, Joi } = require('celebrate');
const http2 = require('http2');
const express = require('express');
const mongoose = require('mongoose'); //подключение БД Монго
const app = express(); //создание точки входа
const bodyParser = require('body-parser');  //подключение парсера

const userRoutes = require('./routes/usersRoutes'); //подключение роутов пользователя
const cardsRoutes = require('./routes/cardRoutes'); //добавление роутов карточек

const { createUser, login } = require('./controllers/userControllers'); //подключение обработчиков авторизации и регистрации
const auth = require('./middlewares/auth'); //подключение защиты роутов авторизацией
const errorHandler = require('./middlewares/errorHandler'); //подключение обработчика ошибок

const { PORT = 3000} = process.env;

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // за 15 минут
  max: 1000 // можно совершить максимум 100 запросов с одного IP
});

/* Адрес БД */
const mestodb = 'mongodb://127.0.0.1:27017/mestodb';
/* Получение подключения */
const db = mongoose.connection;
/* Подключение к серверу Mongo */
mongoose.connect(mestodb)
/* Подключение к событию ошибки */
db.on('error', console.error.bind(console, 'ошибка подключения к mestoDB'))
app.use(limiter);
app.use(bodyParser.json()); // настройка парсера для приёма JSON

/* Мидлвара добавления user в каждый запрос */
/* app.use((req, res, next) => {
  req.user = {
    _id: '64b1bffe3939ba8f0f010d73'
  };
  next();
}); */

/* Добавление роутов */
/* Роуты, не требующие авторицзации */
app.use('/signin',
celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
  }),
}),
login);
app.use('/signup',
celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    //  .pattern(new RegExp('^[A-Za-z0-9]{8,30}$')), //автотест не всегда может пройти
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .regex(/^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/),
  }),
}),
createUser);

/* Роуты, требующие авторицзации */
app.use(auth);
app.use('/', userRoutes);
app.use('/', cardsRoutes);


app.all('*', (req, res) => {
 res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({message: "Страница не найдена"})
});

/* обработчик ошибок */
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Прослушивание порта ${PORT}`)
});