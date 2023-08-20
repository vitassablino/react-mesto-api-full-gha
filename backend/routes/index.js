// IMPORT PACKAGES
const rootRouter = require('express').Router();

const signin = require('./signin');
const signup = require('./signup');
const users = require('./usersRoutes');
const cards = require('./cardRoutes');
const notFound = require('./notFound');

const auth = require('../middlewares/auth');

rootRouter.use('/signin', signin);
rootRouter.use('/signup', signup);
rootRouter.use('/users', auth, users);
rootRouter.use('/cards', auth, cards);
rootRouter.use('*', auth, notFound);

module.exports = rootRouter;