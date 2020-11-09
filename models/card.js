const { all } = require('sequelize/types/lib/operators');
const db = require('../db');

class Card {
    constructor(id, id_suit, id_value) {
        this.id = id;
        this.id_suit = id_suit;
        this.id_value = id_value;
    }

    static all() {
        return db
        .any('SELECT * FROM card')
        .map(({id, id_suit, id_value}) => 
            new Card(id, id_suit, id_value)
        );
    }

    static findOneById(id) {
        return db
        .one('SELECT * FROM card WHERE id=${id}', {id})
        .map(({id, id_suit, id_value}) => 
            new Card(id, id_suit, id_value)
        );
    }

    static findByIdSuit(id_suit) {
        return db
        .any('SELECT * FROM card WHERE id_suit=${id_suit}', {id_suit})
        .map(({id, id_suit, id_value}) => 
            new Card(id, id_suit, id_value)
        );
    }

    static findByIdValue(id_value) {
        return db
        .any('SELECT * FROM card WHERE id_value=${id_value}', {id_value})
        .map(({id, id_suit, id_value}) => 
            new Card(id, id_suit, id_value)
        );
    }


}

module.exports = Card;