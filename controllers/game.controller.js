const Game = require('../classes/game');
const Deck = require('../classes/deck');
// eslint-disable-next-line no-unused-vars
const GamePlayer = require('../classes/game_player');

exports.create = async (req, res) => {
  // Create a new deck to get deck_id, then create a game with deck_id
  // Create a game_player with the id_game and id_player
  let newGame;
  console.log('THE REQBODY IS:   ', req.body);
  Deck.createNewDeck().then((results) => {
    console.log('THE DECKCREATE RESULTS: ', results);
    newGame = new Game(undefined, 1, results.id, 0);
    newGame
      .save()
      .then((results2) => {
        console.log('THE RESULTS ARE:  ', results2);
        const gamePlayer = new GamePlayer(undefined, results2.id, req.body.id);
        gamePlayer.save();
        return res.send(results2);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        // eslint-disable-next-line no-undef
        response.json({ error });
      });
  });
};

exports.findAll = async (req, res) => {
  Game.findAll()
    .then((game) => {
      return res.send({ game });
    })
    .catch((err) => {
      return res.status(422).send({ error: err.message });
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
