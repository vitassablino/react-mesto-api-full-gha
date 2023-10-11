const {
  ValidationError,
  DocumentNotFoundError,
  CastError,
} = require('mongoose').Error;
const Card = require('../models/card');
const http2 = require('http2');

/* Получение карточек */
module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

/*  Обработка POST запроса /cards  */
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(http2.constants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
      } else {
        next(err);
      }
    });
};

/*  Обработка DELETE запроса /cards/:Id  */
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      Card.deleteOne({ _id: card._id, owner: req.user._id })
        .then((result) => {
          if (result.deletedCount === 0) {
            res.status(http2.constants.HTTP_STATUS_FORBIDDEN).send({ message: `Вы не являетесь автором карточки. Удаление невозможно`});
          }
          res.send({ message: 'Пост удалён' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
      res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
      } else {
        next(err);
      }
    });
};

/*  Обработка PUT запроса /cards/:cardId/likes  */
const cardLikesUpdate = (req, res, updateData, next) => {
  Card.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({message: `Произошла ошибка: карточка с указанным ID не обнаружена`})
      } else if (err instanceof CastError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
      } else {
        next(err);
      }
    });
};

/* лайк */
module.exports.likeCard = (req, res, next) => {
  const updateData = { $addToSet: { likes: req.user._id } };
  cardLikesUpdate(req, res, updateData, next);
};

/* Снятие лайка */
module.exports.dislikeCard = (req, res, next) => {
  const updateData = { $pull: { likes: req.user._id } };
  cardLikesUpdate(req, res, updateData, next);
};
