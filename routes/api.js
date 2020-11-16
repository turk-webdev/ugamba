const express = require('express');

const router = express.Router();
const deckController = require('../controllers/deck.controller.js');
const testController = require('../controllers/test.controller.js');

// Deck API calls
router.get('/deck/card/all', deckController.showAll);
router.get('/deck/card/:id', deckController.showCard);

// Test API calls
router.get('/all/:table', testController.showAll);

router.get('/', (request, response) => {
  response.send('Hello API');
});

module.exports = router;
