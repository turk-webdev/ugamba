const { all } = require('sequelize/types/lib/operators');
const db = require('../db');

class CardSuit {
    constructor(id, suit) {
        this.id = id;
        this.suit = suit;
    }

    static all() {
        return db
        .any('SELECT * FROM card_suit')
        .map(({id, suit}) => 
            new CardSuit(id, suit)
        );
    }

    static findOneById(id) {
        return db
        .one('SELECT * FROM card_suit WHERE id=${id}', {id})
        .map(({id, suit}) => 
            new CardSuit(id, suit)
        );
    }

    static findBySuit(suit) {
        return db
        .any('SELECT * FROM card_suit WHERE suit=${suit}', {suit})
        .map(({id, suit}) => 
            new CardSuit(id, suit)
        );
    }


}

module.exports = CardSuit;