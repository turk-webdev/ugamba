const db = require('../db');

class Game_player {
  constructor(id, id_game, id_user) {
    this.id = id;
    this.id_game = id_game;
    this.id_user = id_user;
  }

  save() {
    return db.oneOrNone(
      `INSERT INTO game_player (id, id_game, id_user, blind_status, player_folded) VALUES (DEFAULT, $1, $2, $3, $4)`,
      [this.id_game, this.id_user, 0, 0],
    );
  }

  static findAllGamesByUserId(user_id) {
    return db.any(
      `SELECT game.id, game.num_players, game.game_pot, game.min_bet, game.game_round, game.curr_game_player_id FROM game INNER JOIN game_player ON game.id=game_player.id_game WHERE game_player.id_user=$1;`,
      [user_id],
    );
  }
}

module.exports = Game_player;
