require('dotenv').config();
const rateLimit = require('express-rate-limit');
const { errors, celebrate, Joi } = require('celebrate');
const http2 = require('http2');
const express = require('express');
const mongoose = require('mongoose'); //подключение БД Монго
const cors = require('./middlewares/cors'); //Подключение мидлвары CORS
const app = express(); //создание точки входа
const bodyParser = require('body-parser');  //подключение парсера
const cookieParser = require('cookie-parser')
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

const { requestLogger, errorLogger } = require('./middlewares/logger'); // Подключение логгеров

/* Адрес БД */
const mestodb = 'mongodb://127.0.0.1:27017/mestodb1';
/* Получение подключения */
const db = mongoose.connection;

app.use(express.json()); // настройка парсера для приёма JSON
app.use(cookieParser());
app.use(cors);

/* Подключение к серверу Mongo */
mongoose.connect(mestodb/* , {useNewUrlParser: true, useUnifiedTopology: true } */);
/* Подключение к событию ошибки */
db.on('error', console.error.bind(console, 'ошибка подключения к mestoDB'))
app.use(limiter);

/* Мидлвара добавления user в каждый запрос */
/* app.use((req, res, next) => {
  req.user = {
    _id: '64b1bffe3939ba8f0f010d73'
  };
  next();
}); */

app.use(requestLogger); // подключаем логгер запросов

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
app.use(errorLogger); //подключаем логгер ошибок

app.listen(PORT, () => {
  console.log(`Прослушивание порта ${PORT}`)
});