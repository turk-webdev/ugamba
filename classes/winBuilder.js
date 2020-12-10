/* eslint-disable*/

// This file will help build the initial object used by winChecker.js
require('lodash.combinations');
let _ = require('lodash');

const Deck = require('./deck');
const GamePlayer = require('./game_player');

const getAllPlayersPossibleHands = async (gameId) => {
    let deckId = await Deck.getDeckByGameId(gameId);
    let playersInGame = await GamePlayer.getAllPlayersInGame(gameId);
    let dealer = await GamePlayer.getGameDealer(gameId);
    let dealerHand = await Deck.getAllOwnedCardsOfPlayer(deckId.id_deck, dealer.id);
    let resultObj = {};

    for (const index in playersInGame) {
        let playerCards = await Deck.getAllOwnedCardsOfPlayer(deckId.id_deck, playersInGame[index].id)
        let comboObject = {};

        let playerHand = [];
        for (const playerCardIndex in playerCards) {
            playerHand.push(playerCards[playerCardIndex].id_card);
        }

        let dealerHandArr = [];
        for (const dealerCardIndex in dealerHand) {
            dealerHandArr.push(dealerHand[dealerCardIndex].id_card);
        }
        
        let combinations = _.combinations(dealerHandArr.concat(playerHand), 5);
        for (const comboIndex in combinations) {
            comboObject[comboIndex] = combinations[comboIndex];
        }
        
        let handObject = { hands: comboObject };
        resultObj[playersInGame[index].id] = handObject;
    }

    return resultObj;
};

module.exports = {
    getAllPlayersPossibleHands,
};
