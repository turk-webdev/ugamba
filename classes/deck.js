const db = require('../db');

class Deck {
    constructor(id) {
        this.id = id;
    }

    static all() {
        return db
        .any('SELECT * FROM deck')
        .map(({id}) => 
            new Deck(id)
        );
    }

    static findOneById(id) {
        return db
        .one(`SELECT * FROM deck WHERE id=$1`, [id])
        .map(({id}) => 
            new Deck(id)
        );
    }


}

module.exports = Deck;