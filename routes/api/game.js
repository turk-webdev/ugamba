const express = require('express');

const router = express.Router();
const Game = require('../../controllers/game.controller.js');

router.get('/:game_id', Game.joinGame);

router.post('/join', Game.createOrJoin);
router.post('/:game_id/:game_action', Game.actionHandler);

module.exports = router;
