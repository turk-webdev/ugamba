const express = require('express');

const router = express.Router();
const deckController = require('../controllers/deck.controller.js');
const testController = require('../controllers/test.controller.js');

// Deck API calls
router.get('/deck/card/all', deckController.showAll);
router.get('/deck/card/:id', deckController.showCard);

// Test API calls
// Tested & working
router.get('/all/:table', testController.showAll);
router.get('/one/single/exact/:table/:col/:query',testController.getOneExact);
router.get('/any/single/exact/:table/:col/:query',testController.getAnyExact);

// Tested & not working
router.get('/one/single/like/:table/:col/:query',testController.getOneLike);
router.get('/any/single/like/:table/:col/:query',testController.getAnyLike);

router.get('/', (request, response) => {
  response.send('Hello API');
});

router.get('/test/:arr', (request, response) => {
  console.log('target');
  console.log(request.params.arr);
  response.send('hi');
});

module.exports = router;
