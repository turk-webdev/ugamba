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

router.post('/win', (req,res) => {
  const { game_id } = req.body;
  WinBuilder.getAllPlayersPossibleHands(game_id);
});

module.exports = router;
