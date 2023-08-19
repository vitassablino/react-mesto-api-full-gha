const jwt = require('jsonwebtoken');
const http2 = require('http2');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const userToken = req.cookies.jwt; // достаём токен

/*   if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({message: "Для доступа необходимо авторизироваться"});
    return;
  } */

  let payload;

  try {
    payload = jwt.verify(userToken, NODE_ENV === 'production' ? JWT_SECRET : 'token-key');
  } catch (err) {
    res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({message: "Для доступа необходимо авторизироваться!"});
    return;
  }

  req.user = payload;
  next();
};