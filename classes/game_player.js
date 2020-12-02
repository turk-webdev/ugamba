const db = require('../db');

class Game_player {
  constructor(id, id_game, id_user) {
    this.id = id;
    this.id_game = id_game;
    this.id_user = id_user;
  }

  save() {
    return db.oneOrNone(
      `INSERT INTO game_player (id, id_game, id_user, blind_status, player_folded) VALUES (DEFAULT, $1, $2, $3, $4);`,
      [this.id_game, this.id_user, 0, 0],
    );
  }

  static findAllGamesByUserId(user_id) {
    return db.any(
      `SELECT game.id, game.num_players, game.game_pot, game.min_bet, game.game_round, game.curr_game_player_id FROM game INNER JOIN game_player ON game.id=game_player.id_game WHERE game_player.id_user=$1;`,
      [user_id],
    );
  }

  static findAllGamesNotParticipating(user_id) {
    // finds all games the user with user_id is currently not in
    return db.any(
      `SELECT * FROM game WHERE game.id NOT IN(SELECT game.id FROM game INNER JOIN game_player ON game.id=game_player.id_game WHERE game_player.id_user=$1);`,
      [user_id],
    );
  }

  static setPlayertoFold(id_user, id_game) {
    return db.none(
      `UPDATE game_player SET player_folded = 1 WHERE id_user = $1 AND id_game = $2;`,
      [id_user, id_game],
    );
  }

  static setPlayertoUnfold(id_user, id_game) {
    return db.none(
      `UPDATE game_player SET player_folded = 0 WHERE id_user = $1 AND id_game = $2;`,
      [id_user, id_game],
    );
  }

  static setPlayerBlind(id_user, id_game, blind_status) {
    return db.none(
      `UPDATE game_player SET blind_status = $1 WHERE id_user = $2 AND id_game = $3;`,
      [blind_status, id_user, id_game],
    );
  }

  static removePlayer(id_user, id_game) {
    return db.none(`DELETE FROM game_player WHERE id_user=$1 AND id_game=$2;`, [
      id_user,
      id_game,
    ]);
  }
}

module.exports = Game_player;
