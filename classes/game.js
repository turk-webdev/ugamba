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
      `INSERT INTO game (id, num_players, id_deck, game_pot) VALUES (DEFAULT, $1, $2, $3) ON CONFLICT DO NOTHING RETURNING id, num_players, id_deck, game_pot;`,
      [this.num_players, this.id_deck, this.game_pot],
    );
  }

  static findAll() {
    return db.any(
      `SELECT * FROM "game"`,
    );
  }

  static findById(id) {
    return db.one(`SELECT * FROM game AS U WHERE U.id = $1`, [id]);
  }

  static updateGame(id, newNumPlayer) {
    return db.none(`INSERT INTO game (id, num_players, id_deck, game_pot) VALUES (DEFAULT, $1, $2, $3) ON CONFLICT DO NOTHING RETURNING id, num_players, id_deck, game_pot;`,
    [num_players, id_deck, game_pot]
    );
  }

  static delete(id) {
    return db.none(`DELETE FROM game WHERE id=$1`, [id]);
  }
}

module.exports = Game;
