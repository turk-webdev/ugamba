/* eslint-disable*/
const express = require('express');

const router = express.Router();
const db = require('../db');

const WinBuilder = require('../classes/winBuilder');

router.get('/', (_, response) => {
  db.any(`INSERT INTO "game" ("num_players") VALUES (${69420})`)
    .then(() => db.any(`SELECT * FROM "game"`))
    .then((results) => response.json(results))
    .catch((error) => {
      console.log(error);
      response.json({ error });
    });
});

// Before posting here, you must create a game
// Manually populate players into the game
router.post('/init-game', (req,res) => {
  // Adjust these based on your test game
  const MY_PORT = 3000;
  const GAME_ID = 0;
  const PLAYER_IDS = [2,3,4,5];
  const DEALER_ID = 6;    
    fetch(
      'http://localhost:'+MY_PORT+'/api/deck/init/0', 
      { 
        method: 'get', 
        headers: { 'Content-Type': 'application/json'},
      }).then(console.log)

      // Put 5 cards for dealer
      for (let i=0; i<5; i++) {
        fetch(
          'http://localhost:'+MY_PORT+'/api/deck/deal', 
          { 
            method: 'post', 
            headers: { 'Content-Type': 'application/json'}, 
            body: JSON.stringify({
                id_game: GAME_ID,
                id_game_player: DEALER_ID
            })
          }).then(console.log)
      }

      // Put 2 cards for each player
      for (let i=0; i<2; i++) {
        PLAYER_IDS.forEach(player => {
          fetch(
            'http://localhost:'+MY_PORT+'/api/deck/deal', 
            { 
              method: 'post', 
              headers: { 'Content-Type': 'application/json'}, 
              body: JSON.stringify({
                  id_game: GAME_ID,
                  id_game_player: player
              })
            }).then(console.log)
        })
      }

      fetch(
        'http://localhost:'+MY_PORT+'/tests/win', 
        { 
          method: 'post', 
          headers: { 'Content-Type': 'application/json'}, 
          body: JSON.stringify({
              id_game: ID_GAME
          })
        }).then(console.log)
});

router.post('/win', (req,res) => {
  const { game_id } = req.body;
  WinBuilder.getAllPlayersPossibleHands(game_id);
});

module.exports = router;
