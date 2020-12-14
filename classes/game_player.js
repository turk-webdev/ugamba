const db = require('../db');

class Game_player {
  constructor(id, id_game, id_user) {
    this.id = id;
    this.id_game = id_game;
    this.id_user = id_user;
  }

  save() {
    return db.oneOrNone(
      `INSERT INTO game_player (id, id_game, id_user, blind_status, player_folded) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING id;`,
      [this.id_game, this.id_user, 0, 1],
    );
  }

  static updateAllUsersOfGameToUnfold(game_id) {
    return db.none(
      `UPDATE game_player SET player_folded = 0 WHERE id_game = $1`,
      [game_id],
    );
  }

  static resetLastActionOfAllUsersInGame(game_id) {
    return db.none(
      `UPDATE game_player SET player_last_action = NULL WHERE id_game = $1`,
      [game_id],
    );
  }

  static getNumPlayersInGame(game_id) {
    return db.one(
      `SELECT COUNT(*) FROM game_player AS gp WHERE gp.id_game=$1;`,
      [game_id],
    );
  }

  static setBlindStatusOfGamePlayer(game_player_id, blind_status) {
    return db.none(`UPDATE game_player SET blind_status=$1 WHERE id=$2`, [
      blind_status,
      game_player_id,
    ]);
  }

  static getByUserIdAndGameId(user_id, game_id) {
    return db.one(
      `SELECT * FROM game_player AS gp WHERE gp.id_user=$1 AND gp.id_game=$2;`,
      [user_id, game_id],
    );
  }

  static getByGamePlayerId(game_player_id) {
    return db.one(
      `SELECT gp.id, gp.id_game, gp.id_user, gp.blind_status, gp.player_folded, gp.player_last_action,u.username,u.money FROM game_player AS gp INNER JOIN users AS u ON gp.id_user = u.id WHERE gp.id = $1`,
      [game_player_id],
    );
  }

  static findAllGamesByUserId(user_id) {
    return db.any(
      `SELECT game.id, game.game_pot, game.min_bet, game.game_round, game.curr_game_player_id FROM game INNER JOIN game_player ON game.id=game_player.id_game WHERE game_player.id_user=$1 ORDER BY game.id;`,
      [user_id],
    );
  }

  static findAllPlayersByGameId(game_id) {
    return db.any(
      `SELECT u.id, u.username, u.money,gp.id AS gpid, gp.id_game,gp.id_user, gp.blind_status, gp.player_folded  FROM users AS u INNER JOIN game_player AS gp ON u.id=gp.id_user WHERE gp.id_game=$1 ORDER BY gp.id`,
      [game_id],
    );
  }

  static findAllGamesNotParticipating(user_id) {
    // finds all games the user with user_id is currently not in
    return db.any(
      `SELECT * FROM game WHERE game.id NOT IN(SELECT game.id FROM game INNER JOIN game_player ON game.id=game_player.id_game WHERE game_player.id_user=$1) ORDER BY game.id;`,
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

  static setPlayertoUnfoldByPlayerId(id_player, id_game) {
    return db.none(
      `UPDATE game_player SET player_folded = 0 WHERE id = $1 AND id_game = $2;`,
      [id_player, id_game],
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

  static findAllNonFoldedPlayers(id_game) {
    return db.any(
      `SELECT * FROM game_player WHERE id_game=$1 AND player_folded=0 AND id_user > 0 ORDER BY game_player.id;`,
      [id_game],
    );
  }

  static testFindAllPlayers(id_game) {
    return db.any(`SELECT id_user FROM game_player WHERE id_game=$1;`, [
      id_game,
    ]);
  }

  // Returns all non-dealers in game
  static getAllPlayersInGame(game_id) {
    return db.any(
      `SELECT * FROM game_player WHERE id_game=$1 AND id_user>0 AND player_folded=0 ORDER BY game_player.id;`,
      [game_id],
    );
  }

  static getGameDealer(game_id) {
    return db.one(`SELECT * FROM game_player WHERE id_game=$1 AND id_user=0;`, [
      game_id,
    ]);
  }

  static updatePlayerLastAction(id_game, id_user, user_action) {
    return db.none(
      `UPDATE game_player SET player_last_action = $1 WHERE id_user = $2 AND id_game = $3;`,
      [user_action, id_user, id_game],
    );
  }

  static getNonFoldedPlayerLastActions(id_game) {
    return db.any(
      `SELECT * FROM game_player WHERE id_game=$1 AND player_folded=0 ORDER BY game_player.id;`,
      [id_game],
    );
  }

  static deleteAllPlayersFromGame(id_game) {
    return db.none(`DELETE FROM game_player WHERE game_player.id_game=$1`, [
      id_game,
    ]);
  }
}

module.exports = Game_player;
