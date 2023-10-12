const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_KEY } = process.env;
const http2 = require('http2');
const { MODE_PRODUCTION, DEV_KEY } = require('../utils/config');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({ message: 'Для доступа необходимо авторизироваться' });
    return;
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === MODE_PRODUCTION ? SECRET_KEY : DEV_KEY);
  } catch (err) {
    res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({ message: 'Для доступа необходимо авторизироваться!' });
    return;
  }
  req.user = payload;
  next();
};
