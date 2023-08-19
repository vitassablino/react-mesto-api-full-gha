const winston = require('winston');
const expressWinston = require('express-winston');


/* Сохранение логов запросов (в корень бэкенда) */
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

  /* Сохраняет логов ошибок запросов (в корень бэкенда) */
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};