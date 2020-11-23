const db = require('../db');

class Game {
  constructor(id, num_players, id_deck, game_pot) {
    this.id = id;
    this.num_players = num_players;
    this.id_deck = id_deck;
    this.game_pot = game_pot;
  }

  save() {
    return db.one(
      `INSERT INTO game (id, num_players, id_deck, game_pot) VALUES (DEFAULT, $1, $2, $3) RETURNING id;`,
      [this.num_players, this.id_deck, this.game_pot],
    );
  }

  static createGamePlayer(user_id) {
    return db.any(
      `INSERT INTO game_player (id, id_game, id_player) VALUES (DEFAULT, $1, $2);`,
      [this.id, user_id],
    );
  }

  static createGameDeck() {
    return db.any(`INSERT INTO deck (id) VALUES (DEFAULT);`);
  }

  static findAll() {
    return db.any(`SELECT * FROM "game"`);
  }

  static findById(id) {
    return db.oneOrNone(`SELECT * FROM game AS U WHERE U.id = $1`, [id]);
  }

  static updateGame(id, num_players, id_deck, game_pot) {
    return db.none(
      `UPDATE game SET num_players= '$1', id_deck = '$2', game_pot = '$3' WHERE id= $4;`,
      [num_players, id_deck, game_pot, id],
    );
  }

  static delete(id) {
    return db.none(`DELETE FROM game WHERE id=$1`, [id]);
  }
}

module.exports = Game;
