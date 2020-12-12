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

const getAllCommunityCardsInDeck = (deckId, dealer_id) => {
  return db.any(
    'SELECT * FROM deck_card WHERE id_deck = $1 AND game_player_id = $2',
    [deckId, dealer_id],
  );
};
// If the card is being dealt to the table,
// gamePlayerId should be 0
const assignDeckCardToPlayerHand = (cardId, gamePlayerId) => {
  return db.none('UPDATE deck_card SET game_player_id = $1 WHERE id = $2', [
    gamePlayerId,
    cardId,
  ]);
};

// Returns a gameplayers first 2 cards
const getAllDeckCardsByDeckIdAndGamePlayerId = (deckId, gamePlayerId) => {
  return db.many(
    'SELECT deck_card.id, deck_card.id_card, deck_card.game_player_id, deck_card.id_deck FROM deck_card' +
      ' WHERE deck_card.id_deck = $1 AND deck_card.game_player_id = $2',
    [deckId, gamePlayerId],
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

const getDisplayValueFromValue = (value) => {
  return db.many('SELECT value_display FROM card WHERE value=$1', [value]);
};

const getDisplaySuitFromSuit = (suit) => {
  return db.many('SELECT suit_display FROM card WHERE suit=$1', [suit]);
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
  getAllCommunityCardsInDeck,
  getAllOwnedCardsInDeck,
  assignDeckCardToPlayerHand,
  getAllOwnedCardsOfPlayer,
  getAllDeckCardsByDeckIdAndGamePlayerId,
  unassignAllCardsInDeck,
  getDisplayValueFromValue,
  getDisplaySuitFromSuit,
};
