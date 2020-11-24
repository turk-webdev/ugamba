const Game = require('../classes/game');
const Deck = require('../classes/deck');
const GamePlayer = require('../classes/game_player');

const create = async (req, res) => {
  // Create a new deck to get deck_id,
  // then create a game with the returned deck_id
  // Create a game_player with the id_game and id_player
  const { id } = req.user;
  let newGame;
  Deck.createNewDeck().then((deck) => {
    newGame = new Game(undefined, 1, deck.id, 0);
    newGame
      .save()
      .then((game) => {
        const gamePlayer = new GamePlayer(undefined, game.id, id);
        gamePlayer.save();
        return res.send(game);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        // eslint-disable-next-line no-undef
        return res.status(422).send({ error: 'Game creation failure.' });
      });
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
  // eslint-disable-next-line no-unused-vars
  const io = req.app.get('io');
  /* 
    - we fetch all available games with < max num of players.
    - If there is a game with < max num of players: join the game
    - else: create a game and wait until a new player joins to start the game.
    */
  // console.log('~~~~~~REQ: ', req.user);
  const { id } = req.user;
  let gameIdToJoin;
  let allGamesFull = true;
  let game;

  Game.findAll().then((games) => {
    if (games.length === 0) {
      console.log('No games yet, make a game and gameplayer');
      try {
        game = Game.create();
        const gamePlayer = new GamePlayer(undefined, game.id, id);
        gamePlayer.save();
      } catch (e) {
        res.send({ message: 'there was an error creating a game' });
      }
    }
    // eslint-disable-next-line no-plusplus
    for (const existingGame of games) {
      if (existingGame.num_players < 4) {
        gameIdToJoin = existingGame.id;
        allGamesFull = false;
        break;
      }
    }
    if (allGamesFull === true) {
      // eslint-disable-next-line no-unused-vars
      create(req, res).then((createdGame) => {
        res.redirect(`/join/${createdGame.id}`);
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

  Game.updateGame(id, num_players, id_deck, game_pot)
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
  create,
  findAll,
  findById,
  update,
  deleteGame,
};
