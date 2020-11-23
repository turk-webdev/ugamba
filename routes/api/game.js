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

// eslint-disable-next-line no-unused-vars
router.post('/join', (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const io = req.app.get('io');
  /* 
    - we fetch all available games with < max num of players.
    - If there is a game with < max num of players: join the game
    - else: create a game and wait until a new player joins to start the game.
    */
  // Game.create(req, res);
  // console.log('~~~~~~REQ: ', req.user);
  let gameIdToJoin;

  GameClass.findAll().then((games) => {
    // console.log('GAMES:  ', games);
    if (games.length === 0) {
      // console.log('THERE ARE NO GAMES SO MAKE ONE');
      Game.create(req, res);
    }
    // console.log('THERE ARE ONE OR MORE GAMES');
    let full = true;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < games.length; i++) {
      if (games[i].num_players < 4) {
        // console.log('Found a game with id ', games[i].id);
        gameIdToJoin = games[i].id;
        full = false;
        break;
      }
    }
    if (full === true) {
      Game.create(req, res).then((results) => {
        // console.log('RES: ', results);
      });
    } else {
      // Game.findById(gameIdToJoin).then((gameinfo) => {
      //   res.render('authenticated/game', { gameinfo });
      // });
      // eslint-disable-next-line func-names
      setTimeout(function () {
        io.to(req.session.passport.user.socket).emit('join game', {
          game_id: gameIdToJoin,
        });
      }, 3000);
    }
  });
  // return res.render('authenticated/game');
});

router.post('/', Game.create);
router.get('/', Game.findAll);
router.get('/:id', Game.findById);
router.put('/:id', Game.update);
router.delete('/:id', Game.delete);

module.exports = router;
