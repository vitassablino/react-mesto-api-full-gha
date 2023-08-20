const jwt = require('jsonwebtoken');
const http2 = require('http2');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({message: "Для доступа необходимо авторизироваться"});
    console.log('В запросе отсутствует токен')
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'token-key');
  } catch (err) {
    res.status(http2.constants.HTTP_STATUS_UNAUTHORIZED).send({message: "Для доступа необходимо авторизироваться"});
    console.log('Токен не прошёл верификацию')
    return;
  }
  req.user = payload;
  return next();
};