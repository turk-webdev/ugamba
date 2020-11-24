const express = require('express');

const router = express.Router();
const deckController = require('../../controllers/deck.controller.js');

// Deck API calls
router.get('/init/:gameId', deckController.initDeckForGame);
router.post('/deal', deckController.dealCardToPlayer); // Post body should include JSON with fields: id_game, id_game_player
router.get('/table/:deckId', deckController.getTableCards);
router.post('/reset', deckController.resetGameDeck); // Post body should include JSON with field: id_game

module.exports = router;
