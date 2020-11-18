const Read = require('../classes/dbRead');
const Create = require('../classes/dbCreate');
const Update = require('../classes/dbUpdate');
const Deck = require('../classes/deck');

const MAX_CARD_ID = 52;

const initDeckForGame = (req, res) => {
    // First, create a new deck entry
    Deck.createNewDeck()
    .then((deckId) => {
        // Using deckId, create 52 new cards for that deck
        for (let i=1; i<=MAX_CARD_ID; i++) {
            Deck.createDeckCard(i,deckId);
        }

        return deckId;
    })
    .then((deckId) => {
        // Then, modify the given gameId in body with the new deck
        Deck.assignDeckToGame(deckId, parseInt(req.params.gameId));
    })
    .catch((error) => {
        console.log(error);
        return res.send(error);
    });
};

module.exports = {
    initDeckForGame
};