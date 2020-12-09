const express = require('express');

const router = express.Router();
const Game = require('../../controllers/game.controller.js');
const GameClass = require('../../classes/game.js');
const GamePlayer = require('../../classes/game_player');
const DeckClass = require('../../classes/deck');

const MAX_NUM_PLAYER_IN_GAME = 2;

router.get('/:game_id', async (req, res) => {
  const { game_id } = req.params;
  console.log(`----- ENTERING GAME ${game_id}!`);
  console.log('----- USER INFO: ', req.user);
  const game = await GameClass.findById(game_id);
  console.log('---- CURRENT GAME INFO: ', game);
  const { game_round } = game;
  const games = await GamePlayer.findAllGamesByUserId(req.user.id);
  const players = await GamePlayer.findAllPlayersByGameId(game_id);
  const current_game_player = await GamePlayer.getByUserIdAndGameId(
    req.user.id,
    game_id,
  );
  console.log('---- GAME PLAYER: ', current_game_player);
  let player_cards = [];

  // Page refresh logic.
  if (parseInt(game_round) === 1) {
    console.log('---- GAME ROUND: 1');
    player_cards = await DeckClass.getAllOwnedCardsOfPlayer2(
      game.id_deck,
      current_game_player.id,
    );
    console.log('---- PLAYER CARDS: ', player_cards);
    console.log('PLAYERS IN GAME: ', players);
  } else {
    console.log('---- GAME ROUND: ', game_round);
  }

  if (players.length === MAX_NUM_PLAYER_IN_GAME) {
    console.log('~~~~ THERE ARE MAX PLAYERS IN THE GAME');
  }

  const io = req.app.get('io');

  io.to(req.session.passport.user.socket).emit('join game room', {
    game_id: game.id,
  });

  res.render('authenticated/game', { game, games, players, player_cards });
});

router.delete('/leave/:game_id', Game.leaveGame);

router.post('/join', Game.createOrJoin);
router.put('/fold/:game_id', Game.playerFold);
router.put('/next/:game_id', Game.changeRound);
router.post('/:game_id/:game_action', Game.actionHandler);

module.exports = router;
