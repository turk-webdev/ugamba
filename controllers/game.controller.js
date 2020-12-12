const Game = require('../classes/game');
const Deck = require('../classes/deck');
const GamePlayer = require('../classes/game_player');
const Card = require('../classes/card');
const { PlayerActions } = require('../utils/index');
const User = require('../classes/user');
// const { getGameRound } = require('../classes/game');

const MAX_NUM_PLAYER_IN_GAME = 4;
const MIN_NUM_BEFORE_GAME_START = 2;
const MAX_CARD_ID = 52;

const joinGame = async (req, res) => {
  const io = req.app.get('io');

  const { game_id } = req.params;
  let game = await Game.findById(game_id);
  const { game_round } = game;
  const games = await GamePlayer.findAllGamesByUserId(req.user.id);
  const players = await GamePlayer.findAllPlayersByGameId(game_id);
  let game_player = await GamePlayer.getByUserIdAndGameId(req.user.id, game_id);

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

  if (
    players.length >= MIN_NUM_BEFORE_GAME_START &&
    players.length <= MAX_NUM_PLAYER_IN_GAME
  ) {
    if (parseInt(game_round) === 0) {
      const unorderedPlayers = [];
      players.forEach((player) => {
        Card.addCard(game_id, player.id);
        Card.addCard(game_id, player.id);
        GamePlayer.setPlayertoUnfoldByPlayerId(player.id, game_id);
        unorderedPlayers.push(parseInt(player.id));
        // TODO: Should set the blind status and player order here
      });
      unorderedPlayers.sort((a, b) => a - b);
      await Game.setCurrGamePlayerId(game_id, unorderedPlayers[0]);
      await Game.updateGameRound(game_id, 1);
      game = await Game.findById(game_id);
    }

    game_player = await GamePlayer.getByUserIdAndGameId(req.user.id, game_id);
    if (parseInt(game_player.player_folded) === 0) {
      player_cards = await Deck.getAllDeckCardsByDeckIdAndGamePlayerId(
        game.id_deck,
        game_player.id,
      );
      if (player_cards.length === 2) {
        translatedCard1 = Card.translateCard(player_cards[0].id_card);
        translatedCard2 = Card.translateCard(player_cards[1].id_card);
      }
    }

    if (parseInt(game_round) === 2) {
      Card.addCard(game_id, 0);
      Card.addCard(game_id, 0);
      Card.addCard(game_id, 0);
      await Game.updateGameRound(game_id, 3);
      game = await Game.findById(game_id);
    }

    if (parseInt(game_round) === 3) {
      Card.addCard(game_id, 0);
      await Game.updateGameRound(game_id, 4);
      game = await Game.findById(game_id);
    }

    if (parseInt(game_round) === 4) {
      Card.addCard(game_id, 0);
      await Game.updateGameRound(game_id, 5); // Where winner gets decided ande reset to 0
      game = await Game.findById(game_id);
    }
  }

  const yourCards = { translatedCard1, translatedCard2 };
  io.to(req.session.passport.user.socket).emit('join game room', {
    game_id: game.id,
  });

  res.render('authenticated/game', {
    game,
    games,
    players,
    yourCards,
  });
};

const findAll = async (_, res) => {
  Game.findAll()
    .then((game) => {
      return res.send({ game });
    })
    .catch((err) => {
      return res.send({ error: err.message });
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
  console.log('---- CREATE OR JOIN USER INFO: ', req.user);
  const { id } = req.user;
  let gameIdToJoin;
  let allGamesFull = true;
  let newGame;

  GamePlayer.findAllGamesNotParticipating(id).then(async (games) => {
    if (games.length === 0) {
      console.log('---- NO GAMES');
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
              gamePlayer.save();
              // eslint-disable-next-line func-names
              setTimeout(function () {
                io.to(req.session.passport.user.socket).emit('join game', {
                  game_id: game.id,
                });
              }, 3000);
              return res.send(game);
            })
            .catch((error) => {
              console.log(error);
              return res.status(422).send({ error: 'Game creation failure.' });
            });
        });
      } catch (e) {
        res.send({ message: 'there was an error creating a game' });
      }
    } else {
      console.log('---- SEARCHING fOR FIRST AVAILABLE GAME');
      for (const existingGame of games) {
        // eslint-disable-next-line
        const numOfPlayersInGame = await GamePlayer.getNumPlayersInGame(
          existingGame.id,
        );
        if (parseInt(numOfPlayersInGame.count) < MAX_NUM_PLAYER_IN_GAME) {
          console.log('---- ADDING PLAYER TO GAME');
          gameIdToJoin = existingGame.id;
          const gamePlayer = new GamePlayer(undefined, gameIdToJoin, id);
          gamePlayer.save();
          console.log('---- REDIRECTING TO GAME');
          // eslint-disable-next-line func-names
          setTimeout(function () {
            io.to(req.session.passport.user.socket).emit('join game', {
              game_id: existingGame.id,
            });
          }, 3000);
          allGamesFull = false;
          break;
        }
      }
      if (allGamesFull === true) {
        console.log('---- ALL GAMES ARE FULL MAKE A NEW ONE');
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
                setTimeout(function () {
                  io.to(req.session.passport.user.socket).emit('join game', {
                    game_id: game.id,
                  });
                }, 3000);
                return res.send(game);
              })
              .catch((error) => {
                console.log(error);
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

const findById = async (req, res) => {
  const { id } = req.params;
  Game.findById(id)
    .then((results) => {
      if (!results) {
        return res.status(400).send({ error: 'No game found' });
      }
      return res.send(results);
    })
    .catch((err) => {
      return res.status(400).send({ error: err.message });
    });
};

const update = async (req, res) => {
  const { id } = req.params;
  const { id_deck } = req.body;
  const { game_pot } = req.body;
  const { min_bet } = req.body;
  const { game_round } = req.body;
  const { curr_game_player_id } = req.body;

  Game.updateGame(
    id,
    id_deck,
    game_pot,
    min_bet,
    game_round,
    curr_game_player_id,
  )
    .then(() => {
      return res.send({ message: 'Game has been updated successfully' });
    })
    .catch(() => {
      return res.status(400).send({ error: 'No game found' });
    });
};

const deleteGame = async (req, res) => {
  const { id } = req.params;

  Game.delete(id)
    .then(() => {
      return res.send({ message: 'Game has been deleted successfully' });
    })
    .catch(() => {
      return res.status(400).send({ error: 'No game found' });
    });
};

const playerFold = async (req, res) => {
  const { id_user } = req.body;
  const { game_id } = req.params;

  GamePlayer.setPlayertoFold(id_user, game_id)
    .then(() => {
      return res.send({ message: 'Game_player has been updated successfully' });
    })
    .catch(() => {
      return res.status(400).send({ error: 'No game_player found' });
    });
};

const leaveGame = async (req, res) => {
  const { game_id } = req.params;
  const { id_user } = req.body;

  GamePlayer.removePlayer(id_user, game_id)
    .then(() => {
      return res.send({ message: 'Game_player has been removed successfully' });
    })
    .catch(() => {
      return res.status(400).send({ error: 'No game_player found' });
    });
};

const changeRound = async (req, res) => {
  const { game_id } = req.params;

  Game.getGameRound(game_id)
    .then((results) => {
      if (results === 9) {
        Game.updateGameRound(game_id, 1);
      } else {
        Game.updateGameRound(game_id, results + 1);
      }
    })
    .then(() => {
      return res.send({
        message: 'Game game_round has been updated successfully',
      });
    })
    .catch(() => {
      return res.status(400).send({ error: 'No game found' });
    });
};

const actionHandler = async (req) => {
  const { game_id, game_action } = req.params;
  const { user } = req;
  const action_amount = req.body.amount;
  const i_action_amount = parseInt(action_amount);

  // eslint-disable-next-line
  const userSocket = req.session.passport.user.socket;

  const io = req.app.get('io');

  /*
   *this is the main action handler
   * Each case should emit a socket action to the player making the action,
   *the entire board, or both
   */

  console.log('game_action => ', game_action);
  if (game_action === PlayerActions.LEAVE) {
    await GamePlayer.removePlayer(user.id, game_id);
    io.to(userSocket).emit('status-msg', {
      type: 'success',
      msg: 'Leaving...',
    });
    io.to(userSocket).emit('leave game');
    return;
  }
  const curr_game_player_id = await Game.getCurrGamePlayerId(game_id);
  if (curr_game_player_id.curr_game_player_id !== user.id) {
    // its not that users turn
    console.log('its not that users turn');
    io.to(userSocket).emit('status-msg', {
      type: 'error',
      msg: 'Its not your turn!',
    });
    return;
  }
  // eslint-disable-next-line
  switch (game_action) {
    case PlayerActions.CHECK:
      // literally nothing happens, signify in user game window by greying
      // out actions for that 'turn'?
      console.log('check called');
      await GamePlayer.updatePlayerLastAction(game_id, user.id, game_action);
      io.to(userSocket).emit('status-msg', {
        type: 'success',
        msg: 'Checked!',
      });
      break;
    case PlayerActions.BET:
      {
        // we need to get the users money, validate bet
        // if validated then we can remove the money from the user
        // finally we can then add that amount to the game pot
        const user_money = await User.getMoneyById(user.id);
        const min_bid = await Game.getMinBet(game_id);
        const i_user_money = parseInt(Object.values(user_money));
        const i_min_bid = parseInt(Object.values(min_bid));
        if (i_user_money >= i_action_amount && i_action_amount >= i_min_bid) {
          const new_value = i_user_money - i_action_amount;
          await User.updateMoneyById(user.id, new_value);
          const gamePot = await Game.getGamePot(game_id);
          const i_game_pot = parseInt(Object.values(gamePot));
          await Game.updateGamePot(game_id, i_game_pot + i_action_amount);
          await Game.updateMinBet(game_id, i_action_amount);
          await GamePlayer.updatePlayerLastAction(
            game_id,
            user.id,
            game_action,
          );
          io.to(userSocket).emit('user update', {
            id: user.id,
            money: new_value,
          });
          io.to(game_id).emit('game update', {
            min_bet: i_action_amount,
            game_pot: i_game_pot + i_action_amount,
          });
        } else {
          io.to(userSocket).emit('status-msg', {
            type: 'error',
            msg: 'You dont have enough money!',
          });
          return;
        }
      }
      break;
    case PlayerActions.CALL:
      {
        // we need to get the users money, validate bet
        // if validated then we can remove the money from the user
        // finally we can then add that amount to the game pot
        const user_money = await User.getMoneyById(user.id);
        const min_bid = await Game.getMinBet(game_id);
        const i_user_money = parseInt(Object.values(user_money));
        const i_min_bid = parseInt(Object.values(min_bid));
        if (i_user_money >= i_min_bid) {
          const new_value = i_user_money - i_min_bid;
          await User.updateMoneyById(user.id, new_value);
          const gamePot = await Game.getGamePot(game_id);
          const i_game_pot = parseInt(Object.values(gamePot));
          await Game.updateGamePot(game_id, i_game_pot + i_min_bid);
          await GamePlayer.updatePlayerLastAction(
            game_id,
            user.id,
            game_action,
          );
          io.to(userSocket).emit('user update', {
            id: user.id,
            money: new_value,
          });
          io.to(game_id).emit('game update', {
            min_bet: i_min_bid,
            game_pot: i_game_pot + i_min_bid,
          });
        } else {
          io.to(userSocket).emit('status-msg', {
            type: 'error',
            msg: 'You dont have enough money!',
          });
          return;
        }
      }
      break;
    case PlayerActions.RAISE:
      {
        // we need to get the users money, validate bet
        // if validated then we can remove the money from the user
        // finally we can then add that amount to the game pot
        const user_money = await User.getMoneyById(user.id);
        const min_bid = await Game.getMinBet(game_id);
        const i_user_money = parseInt(Object.values(user_money));
        const i_min_bid = parseInt(Object.values(min_bid));
        if (
          i_user_money >= i_action_amount + i_min_bid &&
          i_action_amount !== 0
        ) {
          const new_value = i_user_money - i_action_amount - i_min_bid;
          await User.updateMoneyById(user.id, new_value);
          const gamePot = await Game.getGamePot(game_id);
          const i_game_pot = parseInt(Object.values(gamePot));
          await Game.updateGamePot(
            game_id,
            i_game_pot + i_action_amount + i_min_bid,
          );
          await Game.updateMinBet(game_id, i_action_amount + i_min_bid);
          await GamePlayer.updatePlayerLastAction(
            game_id,
            user.id,
            game_action,
          );
          io.to(userSocket).emit('user update', {
            id: user.id,
            money: new_value,
          });
          io.to(game_id).emit('game update', {
            min_bet: i_action_amount + i_min_bid,
            game_pot: i_game_pot + i_action_amount + i_min_bid,
          });
        } else if (i_action_amount === 0) {
          io.to(userSocket).emit('status-msg', {
            type: 'error',
            msg: 'Thats not a raise, use Call instead!',
          });
          return;
        } else {
          io.to(userSocket).emit('status-msg', {
            type: 'error',
            msg: 'You dont have enough money!',
          });
          return;
        }
      }
      break;
    case PlayerActions.FOLD:
      io.to(userSocket).emit('status-msg', {
        type: 'success',
        msg: 'Folded!',
      });
      await GamePlayer.setPlayertoFold(user.id, game_id);
      await GamePlayer.updatePlayerLastAction(game_id, user.id, game_action);
      break;
    case PlayerActions.RESET:
      {
        await Game.updateGamePot(game_id, 0);
        await Game.updateMinBet(game_id, 0);
        await User.updateMoneyById(user.id, 1000);
        const user_money = await User.getMoneyById(user.id);
        const min_bid = await Game.getMinBet(game_id);
        const i_user_money = parseInt(Object.values(user_money));
        const i_min_bid = parseInt(Object.values(min_bid));
        const gamePot = await Game.getGamePot(game_id);
        const i_game_pot = parseInt(Object.values(gamePot));
        io.to(userSocket).emit('user update', {
          id: user.id,
          money: i_user_money,
        });
        io.to(game_id).emit('game update', {
          min_bet: i_min_bid,
          game_pot: i_game_pot,
        });
        io.to(userSocket).emit('status-msg', {
          type: 'success',
          msg: 'Reset!',
        });
      }
      break;
  }
  // list of game actions
  /*
   * reset minimum bet - also reset ui components etc
   * check for minimum bet at all, set ui accordingly
   *
   */
  console.log('after switch');

  // GAME TURN CODE
  console.log('OLD CURR GAME PLAYER ID => ', curr_game_player_id);
  const nonFoldedPlayers = await GamePlayer.findAllNonFoldedPlayers(game_id);
  const currPlayerIndex = nonFoldedPlayers.findIndex(
    (element) => element.id_user === curr_game_player_id.curr_game_player_id,
  );
  if (currPlayerIndex + 1 === nonFoldedPlayers.length) {
    await Game.setCurrGamePlayerId(game_id, nonFoldedPlayers[0].id_user);
  } else {
    await Game.setCurrGamePlayerId(
      game_id,
      nonFoldedPlayers[currPlayerIndex + 1].id_user,
    );
  }
  const new_curr_game_player_id = await Game.getCurrGamePlayerId(game_id);
  console.log('NEW CURR GAME PLAYER ID => ', new_curr_game_player_id);
  io.to(game_id).emit(
    'update-turn',
    new_curr_game_player_id.curr_game_player_id,
  );
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
  console.log(player_actions);
  const currPlayerActionIndex = player_actions.findIndex(
    (element) => element.id_user === curr_game_player_id.curr_game_player_id,
  );
  let target_index = currPlayerActionIndex + 1;
  if (target_index === player_actions.length) {
    target_index = 0;
  }
  const lastPlayerAction =
    player_actions[currPlayerActionIndex].player_last_action;
  const nextPlayerAction = player_actions[target_index].player_last_action;
  if (
    (lastPlayerAction === PlayerActions.CHECK ||
      lastPlayerAction === PlayerActions.CALL) &&
    (nextPlayerAction === PlayerActions.BET ||
      nextPlayerAction === PlayerActions.RAISE)
  ) {
    let count = 0;
    for (const action in player_actions) {
      if (
        action.player_last_action === PlayerActions.BET ||
        action.player_last_action === PlayerActions.RAISE
      ) {
        count += 1;
      }
    }
    if (count === 1) {
      console.log('update game round here');
      const curr_game_round = await Game.getGameRound(game_id);
      const i_curr_game_round = curr_game_round.game_round;
      // get the id_game_player via id_user of 0 and curr_game_id
      const dealer_id = await GamePlayer.getByUserIdAndGameId(0, game_id);
      // another switch goes here?
      switch (i_curr_game_round) {
        case (1):
          // i.e. we are going from 1 to 2, so its three cards on the table
          // if this case, do default case three times?
          break;
        default:
          // this should be for everything else i.e 2 to 3, 3 to 4, 4 to 5, we just
          // give the dealer one card
          Deck.getDeckByGameId(parseInt(game_id))
            .then((data) => {
              return parseInt(data.id_deck);
            })
            .then((deckId) => {
              return Deck.getAllUnownedCardsInDeck(deckId);
            })
            .then((data) => {
              const randIndex = Math.floor(Math.random() * data.length); // Generates random int 0 to data.length-1
              return data[randIndex]; // Picks a random card from the dealable cards
            })
            .then((card) => {
              const cardId = parseInt(card.id);
              return Deck.assignDeckCardToPlayerHand(cardId, parseInt(dealer_id));
            })
            .then(() => {
              // socket shit
            })
            .catch((error) => {
              // left over from cpypasta, needs to be addressed?
              // TODO: Do some real error handling/checking
              console.log(error);
              res.sendStatus(500);
            });

      await Game.updateGameRound(game_id, i_curr_game_round + 1);
    }
  }
  if (player_actions.length === 1) {
    console.log('WINNER => ', user.id);
  }

  // return res.send('hello world');
};

module.exports = {
  createOrJoin,
  joinGame,
  findAll,
  findById,
  update,
  deleteGame,
  playerFold,
  leaveGame,
  changeRound,
  actionHandler,
};
