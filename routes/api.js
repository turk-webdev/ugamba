const express = require('express');

const router = express.Router();
const deckController = require('../controllers/deck.controller.js');

// Deck API calls
router.get('/deck/card/all', deckController.showAll);
router.get('/deck/cardId/:id', deckController.getCard);
router.get('/deck/init/:gameId');
router.get('/deck/deal/:gameId/:playerId');

router.get('/', (request, response) => {
  response.send('Hello API');
});

module.exports = router;
