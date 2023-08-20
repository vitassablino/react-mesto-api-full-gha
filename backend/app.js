require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validationErrors = require('celebrate').errors;
const rootRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const { PORT = 3000} = process.env;
const app = express();
const mestodb = 'mongodb://127.0.0.1:27017/mestodb';
const db = mongoose.connection;
mongoose.connect(mestodb)
db.on('error', console.error.bind(console, 'ошибка подключения к mestoDB'))

app.use(express.json());
app.use(cookieParser());


const limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // за 15 минут
  max: 1000 // можно совершить максимум 100 запросов с одного IP
});
app.use(limiter);
app.use(helmet());
app.use(cors);

app.use(requestLogger);
app.use('/', rootRouter);
app.use(errorLogger);
app.use(validationErrors());

app.listen(PORT, () => {
  console.log(`Прослушивание порта ${PORT}`)
});
