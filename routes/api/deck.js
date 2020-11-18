const express = require('express');

const router = express.Router();
const deckController = require('../../controllers/deck.controller.js');

// Deck API calls
router.post('/init/:gameId', deckController.initDeckForGame);


module.exports = router;
