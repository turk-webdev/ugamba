const Game = require('../classes/game');
const Deck = require('../classes/deck');
const GamePlayer = require('../classes/game_player');
const Card = require('../classes/card');
const { PlayerActions } = require('../utils/index');
const User = require('../classes/user');
const { getAllPlayersPossibleHands } = require('../classes/winBuilder');
const { getWinningPlayer } = require('../classes/winChecker');
const Helper = require('../classes/actionHandlerHelper');
// const { getGameRound } = require('../classes/game');

const MAX_NUM_PLAYER_IN_GAME = 7;
const MIN_NUM_BEFORE_GAME_START = 2;
const MAX_CARD_ID = 52;
const SMALL_BLIND_CODE = 1;
const BIG_BLIND_CODE = 2;

// 1=small blind, 2=big blind
const initBlinds = async (players) => {
  const player1Id = players[0].gpid;
  const player2Id = players[1].gpid;
  await GamePlayer.setBlindStatusOfGamePlayer(player1Id, 1);
  await GamePlayer.setBlindStatusOfGamePlayer(player2Id, 2);
};

const updateBlinds = async (req) => {
  const { game_id } = req.params;
  const players = await GamePlayer.getAllPlayersInGame(game_id);
  const smallBlindIndex = players.findIndex(
    (item) => item.blind_status === SMALL_BLIND_CODE,
  );
  const bigBlindIndex = players.findIndex(
    (item) => item.blind_status === BIG_BLIND_CODE,
  );

  const newSmallBlindIndex =
    smallBlindIndex + 1 === players.length ? 0 : smallBlindIndex + 1;
  const newBigBlindIndex =
    bigBlindIndex + 1 === players.length ? 0 : bigBlindIndex + 1;

  await GamePlayer.setBlindStatusOfGamePlayer(players[smallBlindIndex].id, 0);
  await GamePlayer.setBlindStatusOfGamePlayer(players[bigBlindIndex].id, 0);
  await GamePlayer.setBlindStatusOfGamePlayer(
    players[newSmallBlindIndex].id,
    1,
  );
  await GamePlayer.setBlindStatusOfGamePlayer(players[newBigBlindIndex].id, 2);
};

const joinGame = async (req, res) => {
  const io = req.app.get('io');

  const { game_id } = req.params;
  let game = await Game.findById(game_id);
  if (!game) {
    return res.redirect('/404');
  }
  const { game_round } = game;
  const games = await GamePlayer.findAllGamesByUserId(req.user.id);
  let community = [];
  const dealer = await GamePlayer.getByUserIdAndGameId(0, game_id);
  Game.findDeckByGameId(game_id).then((deck) => {
    Deck.getAllCommunityCardsInDeck(deck.id_deck, dealer.id).then(
      (communityCards) => {
        community = communityCards;
      },
    );
  });
  let players = await GamePlayer.findAllPlayersByGameId(game_id);
  if (!players.some((p) => p.id === req.user.id)) {
    return res.redirect('/404');
  }
  let game_player = await GamePlayer.getByUserIdAndGameId(req.user.id, game_id);
  const user = await User.findOneById(game_player.id_user);

  let player_cards = [];

  // Placeholder empty div elements that get loaded properly when time is right.
  let translatedCard1 = {
    value: '',
    suit: '',
  };
  let translatedCard2 = {
    value: '',
    suit: '',
  };

  if (players.length >= MIN_NUM_BEFORE_GAME_START) {
    if (parseInt(game_round) === 0) {
      initBlinds(players);
      players.forEach(async (player) => {
        Card.addCard(game_id, player.gpid);
        Card.addCard(game_id, player.gpid);
        await GamePlayer.setPlayertoUnfoldByPlayerId(player.gpid, game_id);
        // TODO: Should set the blind status and player order here
      });
      await Game.setCurrGamePlayerId(game_id, players[0].gpid);
      await Game.updateGameRound(game_id, 1);
      io.to(game_id).emit('round update', 1);
      io.to(game_id).emit('update-turn', {
        id: players[0].gpid,
        username: players[0].username,
      });
      io.to(game_id).emit('turn-notification-on', players[0].gpid);
      io.to(game_id).emit('add player', {
        id: game_player.id,
        money: user.money,
        username: user.username,
      });
      Game.findDeckByGameId(game_id).then((deck) => {
        // eslint-disable-next-line max-len
        Deck.getAllOwnedCardsInDeck(deck.id_deck).then((playercards) => {
          io.to(game_id).emit('init game', {
            cards: playercards,
          });
        });
      });
      game = await Game.findById(game_id);
    } else {
      io.to(game_id).emit('add player', {
        id: game_player.id,
        money: user.money,
        username: user.username,
      });
    }

    game_player = await GamePlayer.getByUserIdAndGameId(req.user.id, game_id);
    if (parseInt(game_player.player_folded) === 0) {
      player_cards = await Deck.getAllDeckCardsByDeckIdAndGamePlayerId(
        game.id_deck,
        game_player.id,
      );
      if (player_cards.length === 2) {
        translatedCard1 = {
          suit: player_cards[0].suit_display,
          value: player_cards[0].value_display,
        };
        translatedCard2 = {
          suit: player_cards[1].suit_display,
          value: player_cards[1].value_display,
        };
      }
    }
  }

  const yourCards = { translatedCard1, translatedCard2 };
  io.to(req.session.passport.user.socket).emit('join game room', {
    game_id: game.id,
  });
  if (community.length !== 0) {
    community = community.map((card) => {
      return { value: card.value_display, suit: card.suit_display };
    });
  }

  players = await GamePlayer.findAllPlayersByGameId(game_id);
  let currPlayer = { username: '' };
  if (game.curr_game_player_id !== 0) {
    currPlayer = await GamePlayer.getByGamePlayerId(game.curr_game_player_id);
  }
  const userPlayer = players.find((p) => p.id === user.id);
  res.render('authenticated/game', {
    game,
    games,
    players,
    yourCards,
    community,
    currPlayer,
    userPlayer,
  });
};

const createOrJoin = async (req, res) => {
  const io = req.app.get('io');
  // const socket = io();
  /* 
    - we fetch all available games with < max num of players.
    - If there is a game with < max num of players: join the game
    - else: create a game and wait until a new player joins to start the game.
    */
  const { id } = req.user;
  let gameIdToJoin;
  let allGamesFull = true;
  let newGame;

  GamePlayer.findAllGamesNotParticipating(id).then(async (games) => {
    if (games.length === 0) {
      allGamesFull = false;
      try {
        Deck.createNewDeck().then((deck) => {
          for (let i = 1; i <= MAX_CARD_ID; i++) {
            Deck.createDeckCard(i, deck.id);
          }
          newGame = new Game(undefined, deck.id, 0);
          newGame
            .save()
            .then((game) => {
              const gamePlayer = new GamePlayer(undefined, game.id, id);
              const dealer = new GamePlayer(undefined, game.id, 0);
              gamePlayer.save();
              dealer.save();
              // eslint-disable-next-line func-names
              io.to(req.session.passport.user.socket).emit('join game', {
                game_id: game.id,
              });
              return res.send(game);
            })
            .catch(() => {
              return res.status(422).send({ error: 'Game creation failure.' });
            });
        });
      } catch (e) {
        res.send({ message: 'there was an error creating a game' });
      }
    } else {
      for (const existingGame of games) {
        // eslint-disable-next-line
        const numOfPlayersInGame = await GamePlayer.getNumPlayersInGame(
          existingGame.id,
        );
        if (parseInt(numOfPlayersInGame.count) < MAX_NUM_PLAYER_IN_GAME) {
          gameIdToJoin = existingGame.id;
          const gamePlayer = new GamePlayer(undefined, gameIdToJoin, id);
          gamePlayer.save();
          io.to(req.session.passport.user.socket).emit('join game', {
            game_id: existingGame.id,
          });
          allGamesFull = false;
          break;
        }
      }
      if (allGamesFull === true) {
        try {
          Deck.createNewDeck().then((deck) => {
            for (let i = 1; i <= MAX_CARD_ID; i++) {
              Deck.createDeckCard(i, deck.id);
            }
            newGame = new Game(undefined, deck.id, 0);
            newGame
              .save()
              .then((game) => {
                const gamePlayer = new GamePlayer(undefined, game.id, id);
                gamePlayer.save();
                // eslint-disable-next-line func-names
                io.to(req.session.passport.user.socket).emit('join game', {
                  game_id: game.id,
                });
                return res.send(game);
              })
              .catch(() => {
                return res
                  .status(422)
                  .send({ error: 'Game creation failure.' });
              });
          });
        } catch (e) {
          res.send({ message: 'there was an error creating a game' });
        }
      }
    }
  });
};

const actionHandler = async (req, res) => {
  const { game_id, game_action } = req.params;
  const { user } = req;
  const game = await Game.findById(game_id);

  // eslint-disable-next-line
  const userSocket = req.session.passport.user.socket;

  const io = req.app.get('io');

  let updated_game_pot;

  /*
   *this is the main action handler
   * Each case should emit a socket action to the player making the action,
   *the entire board, or both
   */

  if (game_action === PlayerActions.LEAVE) {
    if (Helper.leaveHandler(req) > 0) {
      res.send('error');
    }
  }

  const curr_game_player_id = await Game.getCurrGamePlayerId(game_id);
  const game_player = await GamePlayer.getByUserIdAndGameId(user.id, game_id);
  if (curr_game_player_id.curr_game_player_id !== game_player.id) {
    // its not that users turn
    io.to(userSocket).emit('status-msg', {
      type: 'error',
      msg: 'Its not your turn!',
    });
    return res.send('error');
  }

  // eslint-disable-next-line
  switch (game_action) {
    case PlayerActions.CHECK:
      // Check occurs when the last person didn't raise or bet
      await GamePlayer.updatePlayerLastAction(game_id, user.id, game_action);
      io.to(userSocket).emit('status-msg', {
        type: 'success',
        msg: 'Checked!',
      });
      break;
    case PlayerActions.BET:
      if (Helper.betHandler(req) > 0) {
        return res.send('error');
      }
      break;
    case PlayerActions.CALL:
      Helper.callHandler(req);
      break;
    case PlayerActions.RAISE:
      if (Helper.raiseHandler(req) > 0) {
        return res.send('error');
      }
      break;
    case PlayerActions.FOLD:
      Helper.foldHandler(req);
      break;
  }
  // list of game actions
  /*
   * reset minimum bet - also reset ui components etc
   * check for minimum bet at all, set ui accordingly
   *
   */

  // GAME TURN CODE
  const nonFoldedPlayers = await GamePlayer.findAllNonFoldedPlayers(game_id);
  const currPlayerIndex = nonFoldedPlayers.findIndex(
    (element) => element.id === curr_game_player_id.curr_game_player_id,
  );
  if (currPlayerIndex + 1 === nonFoldedPlayers.length) {
    await Game.setCurrGamePlayerId(game_id, nonFoldedPlayers[0].id);
  } else {
    await Game.setCurrGamePlayerId(
      game_id,
      nonFoldedPlayers[currPlayerIndex + 1].id,
    );
  }
  const new_curr_game_player_id = await Game.getCurrGamePlayerId(game_id);
  const currGamePlayer = await GamePlayer.getByGamePlayerId(
    curr_game_player_id.curr_game_player_id,
  );
  io.to(game_id).emit('update-turn', {
    id: new_curr_game_player_id.curr_game_player_id,
    username: currGamePlayer.username,
  });
  io.to(game_id).emit(
    'turn-notification-off',
    curr_game_player_id.curr_game_player_id,
  );
  io.to(game_id).emit(
    'turn-notification-on',
    new_curr_game_player_id.curr_game_player_id,
  );
  /*
   * after handling the player actions, here is where we send events
   * back to the entire table,
   * i.e if last player in river, calculate winner and display
   * winner of round, gather all cards, distrubute cards etc.
   * these should all be throguh sockets
   */

  // Game Round Checks Here
  // if 1 bet/raise and rest folds - that one person won the game?
  // if 1 bet/raise and rest
  const player_actions = await GamePlayer.getNonFoldedPlayerLastActions(
    game_id,
  );

  updated_game_pot = await Game.getGamePot(game_id);
  updated_game_pot = updated_game_pot.game_pot;

  if (player_actions.length <= 1) {
    const winner = await GamePlayer.getByGamePlayerId(player_actions[0].id);

    io.to(game_id).emit('broadcast winner', {
      winner,
      pot: updated_game_pot,
    });
    await User.updateMoneyById(
      winner.id_user,
      winner.money + parseInt(updated_game_pot),
    );
    io.to(game_id).emit('game update', {
      min_bet: 0,
      game_pot: 0,
    });
    io.to(game_id).emit('user update', {
      id: winner.id,
      money: winner.money + updated_game_pot,
    });
    await GamePlayer.updateAllUsersOfGameToUnfold(game_id);
    await GamePlayer.resetLastActionOfAllUsersInGame(game_id);
    io.to(game_id).emit('round update', 1);
    await Game.updateGameRound(game_id, 1);
    await Deck.unassignAllCardsInDeck(game.id_deck);
    const allPlayers = await GamePlayer.getAllPlayersInGame(game_id);
    await Game.setCurrGamePlayerId(game_id, allPlayers[0].id);
    await Game.updateGamePot(game_id, 0);
    await Game.updateMinBet(game_id, 0);
    io.to(game_id).emit('update-turn', {
      id: allPlayers[0].id,
      username: allPlayers[0].username,
    });
    io.to(game_id).emit(
      'turn-notification-off',
      curr_game_player_id.curr_game_player_id,
    );
    io.to(game_id).emit('turn-notification-on', allPlayers[0].id);
    allPlayers.forEach(async (player) => {
      Card.addCard(game_id, player.id);
      Card.addCard(game_id, player.id);
    });

    io.to(game_id).emit('update community cards', { cards: [] });
    Game.findDeckByGameId(game_id).then((deck) => {
      // eslint-disable-next-line max-len
      Deck.getAllOwnedCardsInDeck(deck.id_deck).then((playercards) => {
        io.to(game_id).emit('init game', {
          cards: playercards,
        });
      });
    });
    updateBlinds(req);
    return res.send('finished solo player');
  }
  const currPlayerActionIndex = player_actions.findIndex(
    (element) => element.id === curr_game_player_id.curr_game_player_id,
  );

  let target_index = currPlayerActionIndex + 1;
  if (target_index === player_actions.length) {
    target_index = 0;
  }
  const lastPlayerAction =
    player_actions[currPlayerActionIndex].player_last_action;
  const nextPlayerAction =
    player_actions[target_index].player_last_action || null;
  if (
    (lastPlayerAction === PlayerActions.CHECK ||
      lastPlayerAction === PlayerActions.CALL) &&
    (nextPlayerAction === PlayerActions.BET ||
      nextPlayerAction === PlayerActions.RAISE)
  ) {
    let count = 0;
    for (const action of player_actions) {
      if (
        action.player_last_action === PlayerActions.BET ||
        action.player_last_action === PlayerActions.RAISE
      ) {
        count += 1;
      }
    }

    if (count === 1) {
      const curr_game_round = await Game.getGameRound(game_id);
      const i_curr_game_round = curr_game_round.game_round;
      // get the id_game_player via id_user of 0 and curr_game_id
      const dealer = await GamePlayer.getByUserIdAndGameId(0, game_id);
      switch (i_curr_game_round) {
        case 1:
          // i.e. we are going from 1 to 2, so its three cards on the table
          // if this case, do default case three times?
          for (let i = 0; i < 3; i++) {
            Card.addCard(game_id, dealer.id);
          }
          Game.findDeckByGameId(game_id).then((deck) => {
            Deck.getAllCommunityCardsInDeck(deck.id_deck, dealer.id).then(
              (communityCards) => {
                io.to(game_id).emit('update community cards', {
                  cards: communityCards,
                });
              },
            );
          });
          break;
        case 4:
          const allPlayersPossibleHands = await getAllPlayersPossibleHands(
            game_id,
          );
          const winningPlayer = getWinningPlayer(allPlayersPossibleHands);
          const winner = await GamePlayer.getByGamePlayerId(winningPlayer.id);
          io.to(game_id).emit('broadcast winner', {
            winner,
            pot: parseInt(updated_game_pot),
          });
          await User.updateMoneyById(
            winner.id_user,
            winner.money + parseInt(updated_game_pot),
          );
          io.to(game_id).emit('game update', {
            min_bet: 0,
            game_pot: 0,
          });
          io.to(game_id).emit('user update', {
            id: winner.id,
            money: winner.money + updated_game_pot,
          });
          await GamePlayer.updateAllUsersOfGameToUnfold(game_id);
          await GamePlayer.resetLastActionOfAllUsersInGame(game_id);
          io.to(game_id).emit('round update', 1);
          await Game.updateGameRound(game_id, 1);
          await Deck.unassignAllCardsInDeck(game.id_deck);
          const allPlayers = await GamePlayer.getAllPlayersInGame(game_id);
          await Game.setCurrGamePlayerId(game_id, allPlayers[0].id);
          await Game.updateGamePot(game_id, 0);
          await Game.updateMinBet(game_id, 0);
          io.to(game_id).emit('update-turn', {
            id: allPlayers[0].id,
            username: allPlayers[0].username,
          });
          io.to(game_id).emit(
            'turn-notification-off',
            curr_game_player_id.curr_game_player_id,
          );
          io.to(game_id).emit('turn-notification-on', allPlayers[0].id);
          allPlayers.forEach(async (player) => {
            Card.addCard(game_id, player.id);
            Card.addCard(game_id, player.id);
          });

          io.to(game_id).emit('update community cards', { cards: [] });
          Game.findDeckByGameId(game_id).then((deck) => {
            // eslint-disable-next-line max-len
            Deck.getAllOwnedCardsInDeck(deck.id_deck).then((playercards) => {
              io.to(game_id).emit('init game', {
                cards: playercards,
              });
            });
          });
          /* TODO: 
            move blinds,
            */
          updateBlinds(req);
          return;
        default:
          // this should be for everything else i.e 2 to 3, 3 to 4, 4 to 5
          // give the dealer one card
          Card.addCard(game_id, dealer.id);
          Game.findDeckByGameId(game_id).then((deck) => {
            Deck.getAllCommunityCardsInDeck(deck.id_deck, dealer.id).then(
              (communityCards) => {
                io.to(game_id).emit('update community cards', {
                  cards: communityCards,
                });
              },
            );
          });
          break;
      }
      io.to(game_id).emit('round update', i_curr_game_round + 1);
      await Game.updateGameRound(game_id, i_curr_game_round + 1);
    }

    // return res.send('hello world');
  }
  return res.send('finished');
};

module.exports = {
  createOrJoin,
  joinGame,
  actionHandler,
};
