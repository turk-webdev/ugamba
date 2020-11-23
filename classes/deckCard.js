const db = require('../db');

class DeckCard {
  constructor(id, id_card, id_deck, id_game_player_hand) {
    this.id = id;
    this.id_card = id_card;
    this.id_deck = id_deck;
    this.id_game_player_hand = id_game_player_hand;
  }

  save() {
    return db.one(
      `INSERT INTO deck_card(id, id_card, id_deck, id_game_player_hand) VALUES (DEFAULT, $1, $2, $3) ON CONFLICT DO NOTHING RETURNING id,id_card,id_deck,id_game_player_hand;`,
      [this.id_card, this.id_deck, this.id_game_player_hand],
    );
  }

  static all() {
    return db
      .any('SELECT * FROM deck_card')
      .map(
        (deckCard) =>
          new DeckCard(
            deckCard.id,
            deckCard.id_card,
            deckCard.id_deck,
            deckCard.id_game_player_hand,
          ),
      );
  }

  static findOneById(id) {
    return db
      .one(`SELECT * FROM deck_card WHERE id=1`, [id])
      .map(
        (deckCard) =>
          new DeckCard(
            deckCard.id,
            deckCard.id_card,
            deckCard.id_deck,
            deckCard.id_game_player_hand,
          ),
      );
  }

  static findByIdCard(id_card) {
    return db
      .one(`SELECT * FROM deck_card WHERE id_card=$1`, [id_card])
      .map(
        (deckCard) =>
          new DeckCard(
            deckCard.id,
            deckCard.id_card,
            deckCard.id_deck,
            deckCard.id_game_player_hand,
          ),
      );
  }

  static findByIdDeck(id_deck) {
    return db
      .one(`SELECT * FROM deck_card WHERE id_deck=$1`, [id_deck])
      .map(
        (deckCard) =>
          new DeckCard(
            deckCard.id,
            deckCard.id_card,
            deckCard.id_deck,
            deckCard.id_game_player_hand,
          ),
      );
  }

  static findByIdGamePlayerHand(id_game_player_hand) {
    return db
      .one(`SELECT * FROM deck_card WHERE id_game_player_hand=$1`, [
        id_game_player_hand,
      ])
      .map(
        (deckCard) =>
          new DeckCard(
            deckCard.id,
            deckCard.id_card,
            deckCard.id_deck,
            deckCard.id_game_player_hand,
          ),
      );
  }

  static deleteById(id) {
    return db.none(`DELETE FROM deck_card WHERE id=$1`, [id]);
  }
}

module.exports = DeckCard;
