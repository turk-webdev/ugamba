const db = require('../db');

class Game_player {
  constructor(id, id_game, id_user) {
    this.id = id;
    this.id_game = id_game;
    this.id_user = id_user;
  }

  save() {
    return db.oneOrNone(
      `INSERT INTO game_player (id, id_game,id_user) VALUES (DEFAULT, $1, $2)`,
      [this.id_game, this.id_user],
    );
  }

  static findAllGamesByUserId(user_id) {
    return db.any(
      `SELECT game.id, game.num_players, game.game_pot FROM game INNER JOIN game_player ON game.id=game_player.id_game WHERE game_player.id_user=1;`,
      [user_id],
    );
  }
}

module.exports = Game_player;
