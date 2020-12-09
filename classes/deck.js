const db = require('../db');

const getCardById = (id) => {
  return db.one('SELECT * FROM card WHERE id = $1', [id]);
};

const getDeckCardById = (id) => {
  return db.one('SELECT * FROM deck_card WHERE id = $1', [id]);
};

const createNewDeck = () => {
  return db.one('INSERT INTO deck DEFAULT VALUES RETURNING id');
};

const assignDeckToGame = (deckId, gameId) => {
  return db.none('UPDATE game SET id_deck = $1 WHERE id = $2', [
    deckId,
    gameId,
  ]);
};

const createDeckCard = (cardId, deckId) => {
  return db.none('INSERT INTO deck_card(id_card,id_deck) VALUES($1,$2)', [
    cardId,
    deckId,
  ]);
};

const getDeckByGameId = (gameId) => {
  return db.one('SELECT * FROM game WHERE id = $1', [gameId]);
};

const getAllCardsInDeck = (deckId) => {
  return db.many('SELECT * FROM deck_card WHERE id_deck = $1', [deckId]);
};

const getAllUnownedCardsInDeck = (deckId) => {
  // eslint-disable-next-line no-console
  console.log(`deckId=${deckId}`);
  return db.many(
    'SELECT * FROM deck_card WHERE id_deck = $1 AND game_player_id IS NULL',
    [deckId],
  );
};

const getAllOwnedCardsInDeck = (deckId) => {
  return db.many(
    'SELECT * FROM deck_card WHERE id_deck = $1 AND game_player_id IS NOT NULL',
    [deckId],
  );
};

// If the card is being dealt to the table,
// playerHandId should be 0
const assignDeckCardToPlayerHand = (cardId, playerHandId) => {
  return db.none(
    'UPDATE deck_card SET game_player_id = $1 WHERE id = $2',
    [playerHandId, cardId],
  );
};

// If we want to get the cards on the table,
// playerHandId should be 0
const getAllOwnedCardsOfPlayer = (deckId, playerHandId) => {
  return db.many(
    'SELECT * FROM card' +
      ' INNER JOIN deck_card' +
      ' ON card.id = deck_card.id_card' +
      ' WHERE deck_card.id_deck = $1 AND deck_card.game_player_id = $2',
    [deckId, playerHandId],
  );
};

const unassignAllCardsInDeck = (deckId) => {
  return db.none(
    'UPDATE deck_card SET game_player_id = NULL WHERE id_deck = $1',
    [deckId],
  );
};

module.exports = {
  getCardById,
  getDeckCardById,
  createNewDeck,
  assignDeckToGame,
  createDeckCard,
  getDeckByGameId,
  getAllCardsInDeck,
  getAllUnownedCardsInDeck,
  getAllOwnedCardsInDeck,
  assignDeckCardToPlayerHand,
  getAllOwnedCardsOfPlayer,
  unassignAllCardsInDeck,
};
