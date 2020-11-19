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
        return Deck.assignDeckToGame(deckId, parseInt(req.params.gameId));
    })
    .then(() => {
        return res.sendStatus(200);
    })
    .catch((error) => {
        // TODO: Do some real error handling/checking
        console.log(error);
        return res.sendStatus(500);
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
        return Deck.getAllUnownedCardsInDeck(deckId)    
    })
    .then((data) => {
        let randIndex = Math.floor(Math.random() * data.length); // Generates random int 0 to data.length-1
        return data[randIndex]; // Picks a random card from the dealable cards
    })
    .then((card) => {
        let cardId = parseInt(card.id);
        return Deck.assignDeckCardToPlayerHand(cardId, parseInt(id_game_player));
    })
    .then(() => {
        return res.sendStatus(200);
    })
    .catch((error) => {
        // TODO: Do some real error handling/checking
        console.log(error);
        return res.sendStatus(500);
    });

};

module.exports = {
    initDeckForGame,
    dealCardToPlayer
};