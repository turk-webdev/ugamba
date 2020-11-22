const db = require('../db');

class CardValue {
  constructor(id, value) {
    this.id = id;
    this.value = value;
  }

  static all() {
    return db
      .any('SELECT * FROM card_value')
      .map((cardValue) => new CardValue(cardValue.id, cardValue.value));
  }

  static findOneById(id) {
    return db
      .one(`SELECT * FROM card_value WHERE id=$1`, [id])
      .map((cardValue) => new CardValue(cardValue.id, cardValue.value));
  }

  static findByValue(value) {
    return db
      .any(`SELECT * FROM card_value WHERE value=$1`, [value])
      .map((cardValue) => new CardValue(cardValue.id, cardValue.value));
  }
}

module.exports = CardValue;
