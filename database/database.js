const mongoose = require('mongoose');

const dbSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: Array, required: true },
  preparation: { type: Array, required: true },
  time: { type: Number, required: true },
  landOfOrigin: { type: String, required: true },
  glutenFree: { type: Boolean, required: true },
  vegan: { type: Boolean, required: true },
  spiceLevel: { type: Number, required: true }
});

const Recipe = mongoose.model('Recipe', dbSchema);
module.exports = Recipe;
