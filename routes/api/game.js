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
  let game = await GameClass.findById(game_id);
  console.log('---- CURRENT GAME INFO: ', game);
  const { game_round } = game;
  const games = await GamePlayer.findAllGamesByUserId(req.user.id);
  const players = await GamePlayer.findAllPlayersByGameId(game_id);
  console.log('---- ALL GAME PLAYERS: ', players);
  const current_game_player = await GamePlayer.getByUserIdAndGameId(
    req.user.id,
    game_id,
  );
  console.log('---- CURRENT GAME PLAYER: ', current_game_player);
  // if (player_cards.length === 2) {
  //   let translatedCard1;
  //   let translatedCard2;

  // }
  // let cardsLoaded = false;

  if (players.length === MAX_NUM_PLAYER_IN_GAME && parseInt(game_round) === 0) {
    console.log('---- GAME ROUND: 0 HAND OUT CARDS AND UPDATE ROUND');
    console.log('---- PLAYERS IN GAME: ', players);
    players.forEach((player) => {
      CardClass.addCard(game_id, player.id);
      console.log('--- ADDED CARD TO USER');
      CardClass.addCard(game_id, player.id);
      console.log('--- ADDED CARD TO USER');
    });
    // cardsLoaded = true;
    await GameClass.updateGameRound(game_id, 1);
    // .then(() => {
    //   player_cards = DeckClass.getAllDeckCardsByDeckIdAndGamePlayerId(
    //     game.id_deck,
    //     current_game_player.id,
    //   );
    //   console.log('---- LAST PLAYERS CARDS: ', player_cards);
    //   translatedCard1 = CardClass.translateCard(player_cards[0].id_card);
    //   translatedCard2 = CardClass.translateCard(player_cards[1].id_card);
    // });
  }

  game = await GameClass.findById(game_id);

  let translatedCard1 = {
    value: 'two',
    suit: 'spade',
  };
  let translatedCard2 = {
    value: 'two',
    suit: 'spade',
  };

  if (
    players.length === MAX_NUM_PLAYER_IN_GAME &&
    parseInt(game.game_round) === 1
  ) {
    const player_cards = await DeckClass.getAllDeckCardsByDeckIdAndGamePlayerId(
      game.id_deck,
      current_game_player.id,
    );
    console.log('---- CURRENT PLAYER CARDS: ', player_cards);
    translatedCard1 = CardClass.translateCard(player_cards[0].id_card);
    translatedCard2 = CardClass.translateCard(player_cards[1].id_card);
  }

  // if (cardsLoaded && parseInt(game.game_round) === 1) {
  //   player_cards = await DeckClass.getAllDeckCardsByDeckIdAndGamePlayerId(
  //     game.id_deck,
  //     current_game_player.id,
  //   );
  //   console.log('---- LAST PLAYERS CARDS: ', player_cards);
  //   translatedCard1 = CardClass.translateCard(player_cards[0].id_card);
  //   translatedCard2 = CardClass.translateCard(player_cards[1].id_card);
  // }

  // if (!cardsLoaded) {
  //   game = await GameClass.findById(game_id);
  //   await GameClass.updateGameRound(game_id, 1);
  // }

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
  console.log('---- YOUR CARDS BEFORE RENDING GAME: ', yourCards);

  res.render('authenticated/game', {
    game,
    games,
    players,
    yourCards,
  });
});

router.delete('/leave/:game_id', Game.leaveGame);

router.post('/join', Game.createOrJoin);
router.put('/fold/:game_id', Game.playerFold);
router.put('/next/:game_id', Game.changeRound);
router.post('/:game_id/:game_action', Game.actionHandler);

module.exports = router;
