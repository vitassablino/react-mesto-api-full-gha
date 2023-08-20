const http2 = require('http2')
module.exports.notFound = (req, res, next) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({message: "Страница не найдена"})
};