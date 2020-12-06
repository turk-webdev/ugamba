const db = require('../db');
const Deck = require('./deck');

class Game {
  constructor(id, num_players, id_deck, game_pot) {
    this.id = id;
    this.num_players = num_players;
    this.id_deck = id_deck;
    this.game_pot = game_pot;
  }

  save() {
    return db.one(
      `INSERT INTO game (id, num_players, id_deck, game_pot, min_bet, game_round, curr_game_player_id) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING id;`,
      [this.num_players, this.id_deck, this.game_pot, 10, 0, 0],
    );
  }

  static create() {
    Deck.createNewDeck()
      .then((deck) => {
        return new Game(undefined, 1, deck.id, 0);
      })
      .catch((error) => {
        console.log('error creating game: ', error);
        throw new Error('Game creation failure.');
      });
  }

  static createGamePlayer(user_id) {
    return db.any(
      `INSERT INTO game_player (id, id_game, id_player, blind_status, player_folded) VALUES (DEFAULT, $1, $2, $3, $4);`,
      [this.id, user_id, 0, 0],
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

  static updateGame(
    id,
    id_deck,
    game_pot,
    min_bet,
    game_round,
    curr_game_player_id,
  ) {
    return db.none(
      `UPDATE game SET id_deck = '$1', game_pot = '$2', min_bet = '$3', game_round = '$4', curr_game_player_id = '$5' WHERE id= $6;`,
      [id_deck, game_pot, min_bet, game_round, curr_game_player_id, id],
    );
  }

  updateGamePot(id) {
    return db.none(`UPDATE game SET game_pot = $1 WHERE id = $2;`, [
      this.game_pot,
      id,
    ]);
  }

  static getGameRound(id) {
    return db.one(`SELECT game_round FROM game WHERE id=$1;`, [id]);
  }

  static updateGameRound(id, game_round) {
    return db.none(`UPDATE game SET game_round = $1 WHERE id = $2;`, [
      id,
      game_round,
    ]);
  }

  static delete(id) {
    return db.none(`DELETE FROM game WHERE id=$1`, [id]);
  }

  static getNumPlayers(game_id) {
    return db.one(
      `SELECT COUNT(*) FROM game_player AS gp WHERE gp.id_game=$1;`,
      [game_id],
    );
  }
}

module.exports = Game;
