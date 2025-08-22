// Seeds a connection and fills DB
const mongoose = require('mongoose');
const Recipe = require('./database/database.js');
const recipes = require('./recipesfortesting.json');

require('dotenv').config();

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB');
    try {
      await Recipe.deleteMany({}); // clear existing recipes
      console.log('Cleared existing recipes.');
      const inserted = await Recipe.insertMany(recipes);
      console.log('Inserted recipes:', inserted.length);
    } catch (err) {
      console.error('Error inserting recipes:', err);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => console.error('Connection error:', err));
