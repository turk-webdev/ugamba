const db = require('../db');

const getCardById = (id) => {
    return db.one('SELECT FROM card WHERE id = $1',[id]);
};

const getDeckCardById = (id) => {
    return db.one('SELECT FROM deck_card WHERE id = $1',[id]);
};

const createNewDeck = () => {
    return db.one('INSERT INTO deck DEFAULT VALUES RETURNING id');
};

const assignDeckToGame = (deckId, gameId) => {
    return db.none('UPDATE game SET id_deck = $1 WHERE id = $2',[deckId,gameId])
};

const createDeckCard = (cardId, deckId) => {
    return db.none('INSERT INTO deck_card(id_card,id_deck) VALUES($1,$2)',[cardId,deckId]);
};

module.exports = {
  getCardById,
  getDeckCardById,
  createNewDeck,
  assignDeckToGame,
  createDeckCard
};