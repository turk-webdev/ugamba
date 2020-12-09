const Deck = require('../classes/deck');

const MAX_CARD_ID = 52;

const initDeckForGame = (req, res) => {
  console.log('here');
  // First, create a new deck entry
  Deck.createNewDeck()
    .then((deckId) => {
      // Using deckId, create 52 new cards for that deck
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i <= MAX_CARD_ID; i++) {
        Deck.createDeckCard(i, deckId.id);
      }

      return deckId;
    })
    .then((deckId) => {
      // Then, modify the given gameId in body with the new deck
      return Deck.assignDeckToGame(deckId.id, parseInt(req.params.gameId));
    })
    .then(() => {
      return res.sendStatus(200);
    })
    .catch((error) => {
      // TODO: Do some real error handling/checking
      console.log(error);
      res.sendStatus(500);
    });
};

// Get the deck currently used by the game
// Then pick a random card from the dealable cards within
// Then assign that card to the id_game_player hand
const dealCardToPlayer = (req, res) => {
  const { id_game } = req.body;
  const { id_game_player } = req.body;
  Deck.getDeckByGameId(parseInt(id_game))
    .then((data) => {
      return parseInt(data.id_deck);
    })
    .then((deckId) => {
      return Deck.getAllUnownedCardsInDeck(deckId);
    })
    .then((data) => {
      const randIndex = Math.floor(Math.random() * data.length); // Generates random int 0 to data.length-1
      return data[randIndex]; // Picks a random card from the dealable cards
    })
    .then((card) => {
      const cardId = parseInt(card.id);
      return Deck.assignDeckCardToPlayerHand(cardId, parseInt(id_game_player));
    })
    .then(() => {
      return res.sendStatus(200);
    })
    .catch((error) => {
      // TODO: Do some real error handling/checking
      console.log(error);
      res.sendStatus(500);
    });
};

const getTableCards = (req, res) => {
  // id_game_player_hand = 0 is ALWAYS table
  Deck.getAllOwnedCardsOfPlayer(parseInt(req.params.deckId), 0)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.log(err);
    });
};

const resetGameDeck = (req, res) => {
  const { id_game } = req.body;
  Deck.getDeckByGameId(id_game)
    .then((data) => {
      Deck.unassignAllCardsInDeck(data.id_deck);
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

module.exports = {
  initDeckForGame,
  dealCardToPlayer,
  getTableCards,
  resetGameDeck,
};
