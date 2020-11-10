const express = require('express');

const router = express.Router();
const db = require('../db');


//create a new game

//get all games
router.get('/', (request, response) => {
    db.any(
        `SELECT * FROM "game"`,
    )
      .then((results) => response.json(results))
      .catch((error) => {
        console.log(error);
        response.json({ error });
      });
  });
//get a game
router.get('/:id', (request, response) => {
    const { id } = req.params
    db.any(
        `SELECT * FROM "game" WHERE id = $1`, [id]
    )
      .then((results) => response.json(results))
      .catch((error) => {
        console.log(error);
        response.json({ error });
      });
  });
//update a game

//delete a game


module.exports = router;
