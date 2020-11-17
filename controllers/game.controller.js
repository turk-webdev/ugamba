const jwt = require('jsonwebtoken');
const Game = require('../classes/game');


exports.create = async (req, res) => {
  const { num_players } = req.body;
  const { id_deck } = req.body;
  const { game_pot } = req.body;
  
  const newGame = new Game(undefined, num_players, id_deck, game_pot);

  newGame
    .save()
    .then((results) => {
      return res.send(results);
    })
    .catch((error) => {
        console.log(error);
        response.json({ error });
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
