require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const validationErrors = require('celebrate').errors;
const rootRouter = require('./routes/index');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const errors = require('./middlewares/errors');

const { PORT, DATABASE } = process.env;
const { DEFAULT_PORT, DEFAULT_DATABASE } = require('./utils/config');

const app = express();

mongoose.connect(DATABASE || DEFAULT_DATABASE, { authSource: 'admin' });

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(cors);

app.use(requestLogger);
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', rootRouter);

app.use(errorLogger);

app.use(validationErrors());
app.use(errors);

app.listen(PORT || DEFAULT_PORT);
