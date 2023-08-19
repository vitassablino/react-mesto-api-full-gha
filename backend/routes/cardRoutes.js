const cardsRouter = require('express').Router();
const {getCards, createCard, deleteCard, likeCard, unlikeCard} = require('../controllers/cardsControllers');
const { celebrate, Joi } = require('celebrate');


/* Получение всех карточек */
cardsRouter.get('/cards', getCards);

/* Создание карточки */
cardsRouter.post('/cards',
celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required()
      .regex(/^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/),
  }),
}),
createCard);

/* Удаление карточки по ID */
cardsRouter.delete('/cards/:cardId',
celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}),
deleteCard);

/* Лайк карточки */
cardsRouter.put('/cards/:cardId/likes',
celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}),
likeCard);

/* Снятие лайка карточки */
cardsRouter.delete('/cards/:cardId/likes',
celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}),
unlikeCard)

module.exports = cardsRouter;