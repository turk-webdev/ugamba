const express = require('express');

const router = express.Router();
const deckController = require('../../controllers/deck.controller.js');

// Deck API calls
router.get('/card/all', deckController.showAll);           // Get all possible cards
router.get('/cardId/:id', deckController.getCard);         // Get specific card by id
router.get('/init/:gameId', deckController.initDeck);      // Initialize a new deck for an existing game


router.get('/', (request, response) => {
  response.send('Hello API');
});

module.exports = router;
