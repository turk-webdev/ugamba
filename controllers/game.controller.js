const Game = require('../classes/game');
const Deck = require('../classes/deck');
// eslint-disable-next-line no-unused-vars
const GamePlayer = require('../classes/game_player');

exports.createOrJoin = async (req, res) => {
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

  Game.findAll().then((games) => {
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
      // eslint-disable-next-line no-unused-vars
      this.create(req, res).then((results) => {
        console.log('RES: ', results);
        const { game_id } = req.params;
        const game = Game.findById(game_id);
        res.render('authenticated/game', { game });
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

exports.create = async (req, res) => {
  // Create a new deck to get deck_id, then create a game with deck_id
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
        res.json({ error });
        return res.status(422).send({ error: 'Game creation failure.' });
      });
  });
};

exports.findAll = async (req, res) => {
  Game.findAll()
    .then((game) => {
      return res.send({ game });
    })
    .catch((err) => {
      return res.send({ error: err.message });
    });
};

exports.findById = async (req, res) => {
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

exports.update = async (req, res) => {
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

exports.delete = async (req, res) => {
  const { id } = req.params;

  Game.delete(id)
    .then(() => {
      return res.send({ message: 'Game has been deleted successfully' });
    })
    .catch(() => {
      return res.status(400).send({ error: 'No game found' });
    });
};
