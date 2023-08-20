const allowedList = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://158.160.52.136',
  'https://158.160.52.136',
  'http://mesto.frontend.akula.nomoreparties.co',
  'https://mesto.frontend.akula.nomoreparties.co'
]



module.exports = (req, res, next) => {
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedList.includes(origin)) {
    console.log('Запрос с разрешённого источника')
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    console.log('Предварительный запрос')
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
};