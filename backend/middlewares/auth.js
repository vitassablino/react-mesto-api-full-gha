const jwt = require('jsonwebtoken');
const http2 = require('http2');

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достаём авторизационный заголовок

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({message: "Для доступа необходимо авторизироваться"});
    return;
  }

  let payload;

  const userToken = authorization.replace('Bearer ', '');   // извлеченние токена

  try {
    payload = jwt.verify(userToken, 'token-key');
  } catch (err) {
    res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({message: "Для доступа необходимо авторизироваться!"});
    return;
  }

  req.user = payload;
  next();
};