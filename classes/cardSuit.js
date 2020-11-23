const db = require('../db');

class CardSuit {
  constructor(id, suit) {
    this.id = id;
    this.suit = suit;
  }

  static all() {
    return db
      .any('SELECT * FROM card_suit')
      .map((cardSuit) => new CardSuit(cardSuit.id, cardSuit.suit));
  }

  static findOneById(id) {
    return db
      .one(`SELECT * FROM card_suit WHERE id=$1`, [id])
      .map((cardSuit) => new CardSuit(cardSuit.id, cardSuit.suit));
  }

  static findBySuit(suit) {
    return db
      .any(`SELECT * FROM card_suit WHERE suit=$1`, [suit])
      .map((cardSuit) => new CardSuit(cardSuit.id, cardSuit.suit));
  }
}

module.exports = CardSuit;
