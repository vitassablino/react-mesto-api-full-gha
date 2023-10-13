/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_KEY } = process.env;
const { MODE_PRODUCTION, DEV_KEY } = require('../utils/config');
const AuthorizationError = require('../errors/authorizationError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new AuthorizationError('Для доступа необходимо авторизироваться'));
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === MODE_PRODUCTION ? SECRET_KEY : DEV_KEY);
  } catch (err) {
    return next(new AuthorizationError('Для доступа необходимо авторизироваться'));
  }
  req.user = payload;
  next();
};
