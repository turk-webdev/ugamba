/* eslint-disable*/

// This file will help build the initial object used by winChecker.js
const Deck = require('./deck');
const GamePlayer = require('./game_player');

const getAllPlayersInGame = (gameId) => {
    let gamePlayers = [];
    GamePlayer.getAllPlayersInGame(gameId)
    .then(data => {
        for (const gamePlayer in data) {
            gamePlayers.push(parseInt(data[gamePlayer].id));
        }
    })
    .catch(err => console.log(err));
    
    return gamePlayers;
};

const getGameDealer = (gameId) => {
    let dealer;

    GamePlayer.getGameDealer(gameId)
    .then(data => {
        dealer = data[0].id;
    })
    .catch(err => console.log(err));

    return dealer;
};

const getDeckId = (gameId) => {
    let deckId;

    Deck.getDeckByGameId(gameId)
    .then(data => {
        deckId = parseInt(data.id);
    })
    .catch(err => console.log(err));

    return deckId;
}

// Constructs the JSON object that is needed by winChecker.getWinningPlayer()
const getAllPlayersPossibleHands = (gameId) => {
    let deckId = getDeckId(gameId);
    let gamePlayers = getAllPlayersInGame(gameId);
    let dealer = getGameDealer(gameId);
    let playerHands = {};
    let dealerCards = [];

    
};

module.exports = {
    getAllPlayersPossibleHands,
};
