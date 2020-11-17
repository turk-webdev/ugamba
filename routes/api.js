const express = require('express');

const router = express.Router();
const deckController = require('../controllers/deck.controller.js');

// Deck API calls
router.get('/deck/card/all', deckController.showAll);       // Get all possible cards
router.get('/deck/cardId/:id', deckController.getCard);     // Get specific card by id
router.get('/deck/init/:gameId', deckController.initDeck);  // Initialize a new deck for a game


router.get('/', (request, response) => {
  response.send('Hello API');
});

module.exports = router;
