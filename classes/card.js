const Deck = require('./deck');

const addCard = (gameId, gpid) => {
  Deck.getDeckByGameId(parseInt(gameId))
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
      return Deck.assignDeckCardToPlayerHand(cardId, parseInt(gpid));
    })
    .then((result) => {
      // return res.sendStatus(200);
      return result;
    })
    .catch((error) => {
      // TODO: Do some real error handling/checking
      console.log(`Error adding card to deck: ${error}`);
      // res.sendStatus(500);
    });
};

const translateCard = (id_card) => {
  let suit;
  let value;
  if (parseInt(id_card) > 0 && parseInt(id_card) < 14) {
    suit = 'club';
    value = parseInt(id_card) + 1;
  } else if (parseInt(id_card) > 13 && parseInt(id_card) < 27) {
    suit = 'diamond';
    value = parseInt(id_card) + 1 - 14;
  } else if (parseInt(id_card) > 26 && parseInt(id_card) < 40) {
    suit = 'heart';
    value = parseInt(id_card) + 1 - 28;
  } else if (parseInt(id_card) > 39 && parseInt(id_card) < 53) {
    suit = 'spade';
    value = parseInt(id_card) + 1 - 42;
  }

  switch (value) {
    case 2:
      value = 'two';
      break;
    case 3:
      value = 'three';
      break;
    case 4:
      value = 'four';
      break;
    case 5:
      value = 'five';
      break;
    case 6:
      value = 'six';
      break;
    case 7:
      value = 'seven';
      break;
    case 8:
      value = 'eight';
      break;
    case 9:
      value = 'nine';
      break;
    case 10:
      value = 'ten';
      break;
    case 11:
      value = 'jack';
      break;
    case 12:
      value = 'queen';
      break;
    case 13:
      value = 'king';
      break;
    case 14:
      value = 'ace';
      break;
    default:
      break;
  }
  return { value, suit };
};

module.exports = {
  translateCard,
  addCard,
};
