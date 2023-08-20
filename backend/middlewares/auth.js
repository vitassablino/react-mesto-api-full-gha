const jwt = require('jsonwebtoken');
const http2 = require('http2');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({message: "Для доступа необходимо авторизироваться"});
    return;
  }

  let payload;
  const token = authorization.replace(bearer, '');

  try {
    payload = jwt.verify(userToken, NODE_ENV === 'production' ? JWT_SECRET : 'token-key');
  } catch (err) {
    res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({message: "Для доступа необходимо авторизироваться!"});
    return;
  }

  req.user = payload;
  next();
};