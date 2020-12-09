const express = require('express');

const router = express.Router();
const Game = require('../../controllers/game.controller.js');
const GameClass = require('../../classes/game.js');
const GamePlayer = require('../../classes/game_player');
const DeckClass = require('../../classes/deck');
const CardClass = require('../../classes/card');

const MAX_NUM_PLAYER_IN_GAME = 2;

router.get('/:game_id', async (req, res) => {
  const io = req.app.get('io');

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
  let translatedCard1;
  let translatedCard2;
  // Page refresh logic.
  // if (parseInt(game_round) === 1) {
  if (players.length === MAX_NUM_PLAYER_IN_GAME) {
    console.log('---- GAME ROUND: 1');
    GameClass.updateGameRound(game_id, 1);
    CardClass.addCard(game_id, current_game_player.id);
    CardClass.addCard(game_id, current_game_player.id);

    player_cards = await DeckClass.getAllDeckCardsByDeckIdAndGamePlayerId(
      game.id_deck,
      current_game_player.id,
    );
    console.log('---- PLAYER CARDS: ', player_cards);

    translatedCard1 = CardClass.translateCard(player_cards[0].id_card);
    translatedCard2 = CardClass.translateCard(player_cards[1].id_card);

    console.log('---- PLAYERS IN GAME: ', players);
  } else {
    console.log('---- GAME ROUND: ', game_round);
    console.log('---- Player length: ', players.length);
  }

  // if (players.length === MAX_NUM_PLAYER_IN_GAME) {
  //   console.log('~~~~ THERE ARE MAX PLAYERS IN THE GAME');
  //   // io.to(game_id).emit('init game', {
  //   //   id: game.id,
  //   //   cards: player_cards,
  //   // });
  // }

  io.to(req.session.passport.user.socket).emit('join game room', {
    game_id: game.id,
  });

  const yourCards = { translatedCard1, translatedCard2 };

  res.render('authenticated/game', {
    game,
    games,
    players,
    player_cards,
    yourCards,
  });
});

router.delete('/leave/:game_id', Game.leaveGame);

router.post('/join', Game.createOrJoin);
router.put('/fold/:game_id', Game.playerFold);
router.put('/next/:game_id', Game.changeRound);
router.post('/:game_id/:game_action', Game.actionHandler);

module.exports = router;
