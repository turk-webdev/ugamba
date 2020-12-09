const express = require('express');

const router = express.Router();
const Game = require('../../controllers/game.controller.js');
const GameClass = require('../../classes/game.js');
const GamePlayer = require('../../classes/game_player');
const DeckClass = require('../../classes/deck');

const MAX_NUM_PLAYER_IN_GAME = 2;

const translateCard = (id_card) => {
  let suit;
  let value;
  if (parseInt(id_card) > 0 && parseInt(id_card) < 14) {
    suit = 'club';
    value = parseInt(id_card) + 1;
  } else if (parseInt(id_card) > 13 && parseInt(id_card) < 27) {
    suit = 'diamond';
    value = parseInt(id_card) + 1 - 14;
  } else if (parseInt(id_card) > 26 && parseInt(id_card) < 40) {
    suit = 'heart';
    value = parseInt(id_card) + 1 - 28;
  } else if (parseInt(id_card) > 39 && parseInt(id_card) < 53) {
    suit = 'spade';
    value = parseInt(id_card) + 1 - 42;
  }

  switch (value) {
    case 2:
      value = 'two';
      break;
    case 3:
      value = 'three';
      break;
    case 4:
      value = 'four';
      break;
    case 5:
      value = 'five';
      break;
    case 6:
      value = 'six';
      break;
    case 7:
      value = 'seven';
      break;
    case 8:
      value = 'eight';
      break;
    case 9:
      value = 'nine';
      break;
    case 10:
      value = 'ten';
      break;
    case 11:
      value = 'jack';
      break;
    case 12:
      value = 'queen';
      break;
    case 13:
      value = 'king';
      break;
    case 14:
      value = 'ace';
      break;
    default:
      break;
  }
  return { value, suit };
};

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
  if (parseInt(game_round) === 1) {
    console.log('---- GAME ROUND: 1');
    player_cards = await DeckClass.getAllOwnedCardsOfPlayer2(
      game.id_deck,
      current_game_player.id,
    );
    console.log('---- PLAYER CARDS: ', player_cards);

    translatedCard1 = translateCard(player_cards[0].id_card);
    translatedCard2 = translateCard(player_cards[1].id_card);

    console.log('---- PLAYERS IN GAME: ', players);
  } else {
    console.log('---- GAME ROUND: ', game_round);
  }

  if (players.length === MAX_NUM_PLAYER_IN_GAME) {
    console.log('~~~~ THERE ARE MAX PLAYERS IN THE GAME');
    // io.to(game_id).emit('init game', {
    //   id: game.id,
    //   cards: player_cards,
    // });
  }

  io.to(req.session.passport.user.socket).emit('join game room', {
    game_id: game.id,
  });

  res.render('authenticated/game', {
    game,
    games,
    players,
    player_cards,
    translatedCard1,
    translatedCard2,
  });
});

router.delete('/leave/:game_id', Game.leaveGame);

router.post('/join', Game.createOrJoin);
router.put('/fold/:game_id', Game.playerFold);
router.put('/next/:game_id', Game.changeRound);
router.post('/:game_id/:game_action', Game.actionHandler);

module.exports = router;
