const { all } = require('sequelize/types/lib/operators');
const db = require('../db');

class CardValue {
    constructor(id, value) {
        this.id = id;
        this.value = value;
    }

    static all() {
        return db
        .any('SELECT * FROM card_value')
        .map(({id, value}) => 
            new CardValue(id, value)
        );
    }

    static findOneById(id) {
        return db
        .one(`SELECT * FROM card_value WHERE id=$1`, [id])
        .map(({id, value}) => 
            new CardValue(id, value)
        );
    }

    static findByValue(value) {
        return db
        .any(`SELECT * FROM card_value WHERE value=$1`, [value])
        .map(({id, value}) => 
            new CardValue(id, value)
        );
    }


}

module.exports = CardValue;