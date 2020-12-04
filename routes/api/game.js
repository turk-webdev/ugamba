const express = require('express');

const router = express.Router();
const Game = require('../../controllers/game.controller.js');
const GameClass = require('../../classes/game.js');
const GamePlayer = require('../../classes/game_player');
// new routes with controllers

/* These are boilerplates for how we should handle game */

router.get('/:game_id', async (req, res) => {
  // get game
  // console.log('-----REQPARAMS: ', req.params);
  const { game_id } = req.params;
  const game = await GameClass.findById(game_id);
  const games = await GamePlayer.findAllGamesByUserId(req.user.id);
  const players = await GamePlayer.findAllPlayersByGameId(game_id);
  res.render('authenticated/game', { game, games, players });
});

router.delete('/leave/:game_id', Game.leaveGame);

router.post('/join', Game.createOrJoin);
router.put('/fold/:game_id', Game.playerFold);
router.put('/next/:game_id', Game.changeRound);
// eslint-disable-next-line no-unused-vars

router.post('/:game_id/:game_action', Game.actionHandler);
// router.delete('/leave', Game.removePlayer);

// router.post('/', Game.create);
// router.get('/', Game.findAll);
// router.get('/:id', Game.findById);
// router.put('/:id', Game.update);
// router.delete('/:id', Game.deleteGame);

module.exports = router;
