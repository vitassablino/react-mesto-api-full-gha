const http2 = require('http2');
const router = require('express').Router();

router.all('*', (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;
