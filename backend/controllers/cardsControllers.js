const http2 = require('http2');
const Card = require('../models/cardScheme');
const User = require('../models/userScheme');

/*  Обработка GET запроса /cards  */
module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(http2.constants.HTTP_STATUS_OK).send(cards))
    .catch(next);
};

/*  Обработка POST запроса /cards  */
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .res.status(http2.constants.HTTP_STATUS_CREATED).send(card)
    .catch((err) => {
      if (err instanceof ValidationError) {
        es.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
        return;
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
            return;
          }
          res.send({ message: 'Пост удалён' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({message: `Произошла ошибка: карточка с указанным ID не обнаружена`})
        return;
      } else if (err instanceof CastError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
        return;
      } else {
        next(err);
      }
    });
};

const cardLikesUpdate = (req, res, updateData, next) => {
  Card.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({message: `Произошла ошибка: карточка с указанным ID не обнаружена`})
        return;
      } else if (err instanceof CastError) {
        res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({ message: `Произошла ошибка: ${err.name}: ${err.message}`});
        return;
      } else {
        next(err);
      }
    });
};

/*  Обработка PUT запроса /cards/:cardId/likes  */
module.exports.likeCard = (req, res, next) => {
  const updateData = { $addToSet: { likes: req.user._id } };
  cardLikesUpdate(req, res, updateData, next);
};

module.exports.dislikeCard = (req, res, next) => {
  const updateData = { $pull: { likes: req.user._id } };
  cardLikesUpdate(req, res, updateData, next);
};