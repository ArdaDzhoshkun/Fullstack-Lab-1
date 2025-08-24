require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const open = require('open').default;
const Recipe = require('../database/database.js');
const server = express();
const { CONNECTION_URL, PORT } = process.env;
const path = require('path');

// Serve static files from root/html
server.use(express.static(path.join(__dirname, '../html')));

// Serve index.html on root
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../html', 'index.html'));
});

// Parser
server.use(bodyParser.json());

// Fetches all recipes
server.get('/api/dishes', async (req, res) => {
    try {
        const allRecipes = await Recipe.find();
        res.status(200).json(allRecipes);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving recipes: " + err.message });
    }
});

// Fetches recipes with name
server.get('/api/dishes/:name', async (req, res) => {
    try {
        const recipeName = req.params.name;
        const recipeFound = await Recipe.findOne({ name: recipeName });
        if (recipeFound) res.status(200).json(recipeFound);
        else res.status(404).json({ message: 'Recipe not found' });
    } catch (err) {
        res.status(500).json({ message: "Error getting recipe by name: " + err.message });
    }
});

// Recipe Adder
server.post('/api/dishes', async (req, res) => {
    const { name, ingredients, preparation, time, landOfOrigin, glutenFree, vegan, spiceLevel } = req.body;
    if (!name || !ingredients || !preparation || !time || !landOfOrigin || glutenFree === undefined || vegan === undefined || spiceLevel === undefined) {
        return res.status(400).json({ message: 'Some required fields are empty' });
    }

    try {
        const existingRecipe = await Recipe.findOne({ name });
        if (existingRecipe) return res.status(409).json({ message: 'Dish already exists' });

        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(500).json({ message: "Error adding new recipe: " + err.message });
    }
});

// Recipe updater
server.put('/api/dishes/:id', async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRecipe) return res.status(404).json({ message: 'Recipe does not exist' });
        res.status(200).json({ message: 'Recipe updated', updatedRecipe });
    } catch (err) {
        res.status(500).json({ message: "Error updating recipe: " + err.message });
    }
});

// Recipe Deleter
server.delete('/api/dishes/:id', async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!deletedRecipe) return res.status(404).json({ message: 'Recipe not found' });
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: "Error deleting recipe: " + err.message });
    }
});

// Managing DB connection
mongoose.connect(CONNECTION_URL)
    .then(() => console.log('Connected to DB'))
    .catch(err => console.error('Connection to DB failed!', err));

// Server starter
const SERVER_PORT = PORT || 5000;
server.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT}`);
    open(`http://localhost:${SERVER_PORT}`);
});
