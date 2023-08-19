module.exports = (err, res, next) => {
  const { responseStatus = err.status || 500, message } = err;
  if (err.kind === 'ObjectId') {
    res.status(400).send({
      message: 'Неверно переданы данные',
    });
  } else {
    res.status(statusCode).send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  }
  next();
};