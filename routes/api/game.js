const express = require('express');

const router = express.Router();
const Game = require('../../controllers/game.controller.js');

router.get('/:game_id', Game.joinGame);

router.delete('/leave/:game_id', Game.leaveGame);

router.post('/join', Game.createOrJoin);
router.put('/fold/:game_id', Game.playerFold);
router.put('/next/:game_id', Game.changeRound);
router.post('/:game_id/:game_action', Game.actionHandler);

module.exports = router;
