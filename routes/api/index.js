const express = require('express');

const router = express.Router();

const deckRouter = require('./deck');
const gameRouter = require('./game');

router.use('/deck', deckRouter);
router.use('/game', gameRouter);

module.exports = router;
