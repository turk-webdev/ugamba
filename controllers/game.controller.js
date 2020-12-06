const Game = require('../classes/game');
const Deck = require('../classes/deck');
const GamePlayer = require('../classes/game_player');
const { PlayerActions } = require('../utils/index');
const User = require('../classes/user');

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
  /* 
    - we fetch all available games with < max num of players.
    - If there is a game with < max num of players: join the game
    - else: create a game and wait until a new player joins to start the game.
    */
  console.log('CREATEORJOINREQUEST: ', req.user);
  const { id } = req.user;
  let gameIdToJoin;
  let allGamesFull = true;
  let newGame;

  GamePlayer.findAllGamesNotParticipating(id).then((games) => {
    if (games.length === 0) {
      console.log('No games yet, make a deck, game and gameplayer');
      allGamesFull = false;
      try {
        Deck.createNewDeck().then((deck) => {
          newGame = new Game(undefined, 1, deck.id, 0);
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
      console.log('There are games, just make a game_player and join the game');
      for (const existingGame of games) {
        console.log(existingGame.num_players);
        if (existingGame.num_players < 2) {
          console.log('NUM PLAYERS IS LESS THAN 2, ADDING PLAYER TO GAME');
          gameIdToJoin = existingGame.id;
          const gamePlayer = new GamePlayer(undefined, gameIdToJoin, id);
          gamePlayer.save();
          Game.updateNumPlayers(gameIdToJoin, existingGame.num_players + 1);
          allGamesFull = false;
          break;
        }
      }
      if (allGamesFull === true) {
        console.log('ALL GAMES ARE FULL MAKE A NEW ONE');
        // eslint-disable-next-line no-unused-vars
        allGamesFull = false;
        try {
          Deck.createNewDeck().then((deck) => {
            newGame = new Game(undefined, 1, deck.id, 0);
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
      } else {
        console.log('REDIRECTING TO GAME');
        // eslint-disable-next-line func-names
        setTimeout(function () {
          io.to(req.session.passport.user.socket).emit('join game', {
            game_id: gameIdToJoin,
          });
        }, 3000);
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
  const { num_players } = req.body;
  const { id_deck } = req.body;
  const { game_pot } = req.body;
  const { min_bet } = req.body;
  const { game_round } = req.body;
  const { curr_game_player_id } = req.body;

  Game.updateGame(
    id,
    num_players,
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

  const io = req.app.get('io');

  /*
   *this is the main action handler
   * Each case should emit a socket action to the player making the action,
   *the entire board, or both
   */

  console.log('game_action => ', game_action);
  console.log('PlayerActions.LEAVE => ', PlayerActions.LEAVE);
  // eslint-disable-next-line
  switch (game_action) {
    case PlayerActions.CHECK:
      // literally nothing happens, signify in user game window by greying
      // out actions for that 'turn'?
      console.log('check called');
      break;
    case PlayerActions.BET: {
      // we need to get the users money, validate bet
      // if validated then we can remove the money from the user
      // finally we can then add that amount to the game pot
      console.log('bet called');
      const results = await User.getMoneyById(user.id);
      if (results >= req.body.amount) {
        User.updateMoneyById(user.id, results + req.body.amount);
        const gamePot = await Game.getGamePot(game_id);
        Game.updateGamePot(game_id, gamePot + req.body.amount);
      } else {
        console.log('User does not have enough money');
      }
      break;
    }
    case PlayerActions.CALL: {
      // would be sick if the game table had like a bet amount or something
      // basically query that amount, then do the same logic as above ^
      const min_bet = await Game.getMinBet(game_id);
      const user_money = await User.getMoneybyId(user.id);
      if (user_money >= min_bet) {
        User.updateMoneyById(user.id, user_money - min_bet);
        const gamePot = await Game.getGamePot(game_id);
        Game.updateGamePot(game_id, gamePot + min_bet);
      } else {
        console.log('User does not have enough money');
      }
      break;
    }
    case PlayerActions.RAISE: {
      // again, would be cool if we had a bet column in the table
      // then we would query that then do the same logic as bet
      // this time the action amount is the amount of money MORE
      // than the minimum bet that we are raising
      const min_bet = await Game.getMinBet(game_id);
      const user_money = await User.getMoneybyId(user.id);
      if (user_money >= min_bet + req.body.amount) {
        User.updateMoneyById(user.id, user_money - min_bet - req.body.amount);
        const gamePot = await Game.getGamePot(game_id);
        Game.updateGamePot(game_id, gamePot + min_bet + req.body.amount);
      } else {
        console.log('User does not have enough money');
      }
      break;
    }
    case PlayerActions.FOLD:
      console.log('fold called');
      await GamePlayer.setPlayertoFold(user.id, game_id);
      io.emit('folded');
      break;
    case PlayerActions.LEAVE:
      console.log('should be leaving game');
      await GamePlayer.removePlayer(user.id, game_id);
      io.emit('leave game');
      // return res.redirect('/') doesnt work for some reason.
      // Have to manually change the location on the frontend
      return;
  }
  // list of game actions
  /*
   * reset minimum bet - also reset ui components etc
   * check for minimum bet at all, set ui accordingly
   *
   */
  console.log('hello world');
  /*
   * after handling the player actions, here is where we send events
   * back to the entire table,
   * i.e if last player in river, calculate winner and display
   * winner of round, gather all cards, distrubute cards etc.
   * these should all be throguh sockets
   */
  // return res.send('hello world');
};

module.exports = {
  createOrJoin,
  findAll,
  findById,
  update,
  deleteGame,
  playerFold,
  leaveGame,
  changeRound,
  actionHandler,
};
