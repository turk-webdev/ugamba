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
    .then(async (card) => {
      const cardId = parseInt(card.id);
      await Deck.assignDeckCardToPlayerHand(cardId, parseInt(gpid));
      return Deck.getDeckCardById(cardId);
    })
    .then((result) => {
      // return res.sendStatus(200);
      console.log('result in addCard => ', result);
      return result;
    })
    .catch(() => {
      // TODO: Do some real error handling/checking
      // res.sendStatus(500);
    });
};
const translateCard = (id_card) => {
  let suit;
  let value;
  if (parseInt(id_card) > 0 && parseInt(id_card) < 14) {
    suit = 'clubs';
    value = parseInt(id_card) + 1;
  } else if (parseInt(id_card) > 13 && parseInt(id_card) < 27) {
    suit = 'diams';
    value = parseInt(id_card) + 1 - 14;
  } else if (parseInt(id_card) > 26 && parseInt(id_card) < 40) {
    suit = 'hearts';
    value = parseInt(id_card) + 1 - 28;
  } else if (parseInt(id_card) > 39 && parseInt(id_card) < 53) {
    suit = 'spades';
    value = parseInt(id_card) + 1 - 42;
  }

  switch (value) {
    case 2:
      value = 2;
      break;
    case 3:
      value = 3;
      break;
    case 4:
      value = 4;
      break;
    case 5:
      value = 5;
      break;
    case 6:
      value = 6;
      break;
    case 7:
      value = 7;
      break;
    case 8:
      value = 8;
      break;
    case 9:
      value = 9;
      break;
    case 10:
      value = 10;
      break;
    case 11:
      value = 'j';
      break;
    case 12:
      value = 'q';
      break;
    case 13:
      value = 'k';
      break;
    case 14:
      value = 'a';
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
