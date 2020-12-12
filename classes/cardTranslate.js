/* eslint-disable */
const Deck = require('./deck');

// These are according to the cards database
// Return strings can be made different to match CSS
const SUITS = {
    1: 'Club',
    2: 'Diamond',
    3: 'Heart',
    4: 'Spade'
}

const VALUES = {
    1: 'Two',
    2: 'Three',
    3: 'Four',
    4: 'Five',
    5: 'Six',
    6: 'Seven',
    7: 'Eight',
    8: 'Nine',
    9: 'Ten',
    10: 'Jack',
    11: 'Queen',
    12: 'King',
    13: 'Ace'
}

const cardIdToObj = async (cardId) => {
    const card = await Deck.getCardById(cardId);

    return {
        'card_id': cardId,
        'suit': card.suit_display,
        'value': card.value_display
    }
};

const codeToString = (isSuitCode, code) => {
    return isSuitCode ? SUITS[code] : VALUES[code];
};

const stringToSuitCode = (string) => {
    return Object.keys(SUITS).find(key => SUITS[key] === string);
};

const stringToValueCode = (string) => {
    return Object.keys(VALUES).find(key => VALUES[key] === string);
};

// Takes a value code [1..13] and returns the string value of a card
const getValueFromCode = async (value) => {
    const card = await Deck.getDisplayValueFromValue(value);
    return card[0].value_display;
};

// Takes a suit code [1..4] and returns the string suit of a card
const getSuitFromCode = async (suit) => {
    const card = await Deck.getDisplaySuitFromSuit(suit);
    return card[0].suit_display;
};

module.exports = {
    cardIdToObj,
    codeToString,
    stringToSuitCode,
    stringToValueCode,
    getValueFromCode,
    getSuitFromCode,
}