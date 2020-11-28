const express = require('express');

const router = express.Router();
const Game = require('../../controllers/game.controller.js');
const GameClass = require('../../classes/game.js');
// new routes with controllers

/* These are boilerplates for how we should handle game */

router.get('/join/:game_id', (req, res) => {
  // get game
  // console.log('-----REQPARAMS: ', req.params);
  const { game_id } = req.params;
  const game = GameClass.findById(game_id);
  res.render('authenticated/game', { game });
});

router.post('/join', Game.createOrJoin);
// eslint-disable-next-line no-unused-vars

// router.delete('/leave', Game.removePlayer);

router.post('/', Game.create);
router.get('/', Game.findAll);
router.get('/:id', Game.findById);
router.put('/:id', Game.update);
router.delete('/:id', Game.deleteGame);

module.exports = router;
