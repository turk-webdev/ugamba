const express = require('express');

const router = express.Router();
const Game = require('../../controllers/game.controller.js');

// new routes with controllers

/* These are boilerplates for how we should handle game */

router.get('/join/:game_id', (req, res) => {
  // get game
  res.render('authenticated/game', { game: undefined });
});

router.post('/join', (req, res) => {
  const io = req.app.get('io');
  /* 
    - we fetch all available games with < max num of players.
    - If there is a game with < max num of players: join the game
    - else: create a game and wait until a new player joins to start the game.
    */
  setTimeout(function () {
    io.to(req.session.passport.user.socket).emit('join game', {
      game_id: '1234',
    });
  }, 3000);
  // return res.render('authenticated/game');
});

router.post('/', Game.create);
router.get('/', Game.findAll);
router.get('/:id', Game.findById);
router.put('/:id', Game.update);
router.delete('/:id', Game.delete);

module.exports = router;
