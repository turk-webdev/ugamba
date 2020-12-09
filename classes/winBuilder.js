/* eslint-disable*/

// This file will help build the initial object used by winChecker.js
require('lodash.combinations');
let _ = require('lodash');

const Deck = require('./deck');
const GamePlayer = require('./game_player');

const getAllPlayersPossibleHands = (gameId) => {
    let deckId;
    let gamePlayerIds = [];
    let dealerId;
    let dealerHand = [];
    let playerHands = {};

    // First we want to populate the player & dealer id's
    GamePlayer.getAllPlayersInGame(gameId)
    .then(data => {
        for (const player in data) {
            gamePlayerIds.push(data[player].id);
        }

        return GamePlayer.getGameDealer(gameId);
    })
    .then(data => {
        dealerId = data[0].id;
        // Now we need the deck id
        return Deck.getDeckByGameId(gameId);
    })
    .then(data => {
        deckId = data.id_deck;
        // Populate the static dealer hand array
        return Deck.getAllOwnedCardsOfPlayer(deckId, dealerId);
    })
    .then(data => {
        for (const card in data) {
            dealerHand.push(data[card].id_card);
        }
    })
    .then(() => {
        // This is where I'm having trouble... building the JSON object
        // that matches the format of the expected one in winChecker.getWinningPlayer() 
        for (let i=0; i<gamePlayerIds.length; i++) {
            Deck.getAllOwnedCardsOfPlayer(deckId, gamePlayerIds[i])
            .then(data => {
                let playerHand = [];
                for (const card in data) {
                    playerHand.push(data[card].id_card);
                }

                playerHands[gamePlayerIds[i]] = { hands: [] };
                
                let combinations = _.combinations(dealerHand.concat(playerHand), 5);
                playerHands[gamePlayerIds[i]].hands.push(combinations);

                console.log(playerHands);
            })
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err));
};

module.exports = {
    getAllPlayersPossibleHands,
};
