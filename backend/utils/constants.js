const LINK_REGEXP = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/im;

const ALLOWED_CORS = [
  'http://mesto.frontend.akula.nomoreparties.co',
  'https://mesto.frontend.akula.nomoreparties.co',
  'http://158.160.123.47',
  'https://158.160.123.47',
  'http://localhost:3000',
  'http://localhost:3001',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  LINK_REGEXP,
  ALLOWED_CORS,
  DEFAULT_ALLOWED_METHODS,
};
