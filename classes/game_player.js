const db = require('../db');

class Game_player {
  constructor(id, id_game, id_user) {
    this.id = id;
    this.id_game = id_game;
    this.id_user = id_user;
  }

  save() {
    return db.oneOrNone(
      `INSERT INTO Game_player (id, id_game, id_player) VALUES (DEFAULT, $1, $2)`,
      [this.id_game, this.id_user],
    );
  }
}

module.exports = Game_player;
