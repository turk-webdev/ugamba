const { all } = require('sequelize/types/lib/operators');
const db = require('../db');

class DeckCard {
    constructor(id, id_card, id_deck, id_game_player_hand) {
        this.id = id;
        this.id_card = id_card;
        this.id_deck = id_deck;
        this.id_game_player_hand = id_game_player_hand; 
    }

    static all() {
        return db
        .any('SELECT * FROM deck_card')
        .map(({id, id_card, id_deck, id_game_player_hand}) => 
            new DeckCard(id, id_card, id_deck, id_game_player_hand)
        );
    }

    static findOneById(id) {
        return db
        .one('SELECT * FROM deck_card WHERE id=${id}', {id})
        .map(({id, id_card, id_deck, id_game_player_hand}) => 
            new DeckCard(id, id_card, id_deck, id_game_player_hand)
        );
    }

    static findByIdCard(id_card) {
        return db
        .one('SELECT * FROM deck_card WHERE id_card=${id_card}', {id_card})
        .map(({id, id_card, id_deck, id_game_player_hand}) => 
            new DeckCard(id, id_card, id_deck, id_game_player_hand)
        );
    }

    static findByIdDeck(id_deck) {
        return db
        .one('SELECT * FROM deck_card WHERE id_deck=${id_deck}', {id_deck})
        .map(({id, id_card, id_deck, id_game_player_hand}) => 
            new DeckCard(id, id_card, id_deck, id_game_player_hand)
        );
    }

    static findByIdGamePlayerHand(id_game_player_hand) {
        return db
        .one('SELECT * FROM deck_card WHERE id_game_player_hand=${id_game_player_hand}', {id_game_player_hand})
        .map(({id, id_card, id_deck, id_game_player_hand}) => 
            new DeckCard(id, id_card, id_deck, id_game_player_hand)
        );
    }

    static insertCardById(id) {
        return db
        .one('SELECT * FROM deck_card WHERE id_game_player_hand=${id_game_player_hand}', {id_game_player_hand})
        .map(({id, id_card, id_deck, id_game_player_hand}) => 
            new DeckCard(id, id_card, id_deck, id_game_player_hand)
        );
    }


}

module.exports = DeckCard;