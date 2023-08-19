const mongoose = require('mongoose');
const validator = require('validator');

const cardScheme = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (correct) => validator.isURL(correct),
      message: 'Некорректный адрес',
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'user'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('card', cardScheme);