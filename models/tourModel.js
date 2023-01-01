const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have Price'],
  },
  duration: {
    type: Number,
    required: true,
    default: 1,
  },
  maxGroupSize: {
    type: Number,
    default: 2,
  },
  difficulty: String,
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
