const db = require('../db');

class Card {
    constructor(id, id_suit, id_value) {
        this.id = id;
        this.id_suit = id_suit;
        this.id_value = id_value;
    }

    static all() {
        console.log('all');
        return db.any('SELECT * FROM card');
    }

    static findOneById(id) {
        console.log('one, id='+id);
        return db.one(`SELECT * FROM card WHERE id=$1`, [id]);
    }

    static findByIdSuit(id_suit) {
        return db.any(`SELECT * FROM card WHERE id_suit=$1`, [id_suit]);
    }

    static findByIdValue(id_value) {
        return db.any(`SELECT * FROM card WHERE id_value=$1`, [id_value]);
    }


}

module.exports = Card;