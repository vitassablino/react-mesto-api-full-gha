const http2 = require('http2');

router.all('*', (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({message: "Страница не найдена"})
 });

module.exports = router;
