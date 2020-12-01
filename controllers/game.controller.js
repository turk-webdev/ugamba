const Game = require('../classes/game');
const Deck = require('../classes/deck');
const GamePlayer = require('../classes/game_player');

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

module.exports = {
  createOrJoin,
  findAll,
  findById,
  update,
  deleteGame,
};
