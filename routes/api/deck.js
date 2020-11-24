const express = require('express');

const router = express.Router();
const deckController = require('../../controllers/deck.controller.js');

// Deck API calls
router.get('/init/:gameId', deckController.initDeckForGame);
router.post('/deal', deckController.dealCardToPlayer); // Body should include JSON with fields: id_game, id_game_player

module.exports = router;
