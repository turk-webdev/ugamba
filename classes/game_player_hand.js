const db = require('../db');

class Game_player_hand {
  constructor(id, id_game_player, strength) {
    this.id = id;
    this.id_game_player = id_game_player;
    this.strength = strength;
  }

  save() {
    return db.oneOrNone(
      `INSERT INTO game_player_hand (id, id_game_player, strength) VALUES (DEFAULT, $1, $2)`,
      [this.id_game_player, this.strength],
    );
  }
}

module.exports = Game_player_hand;
