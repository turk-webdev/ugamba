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
    const { id } = request.params
    console.log(id)
    db.one(
        `SELECT * FROM game AS U WHERE U.id = $1`, [id]
    )
      .then((results) => response.json(results))
      .catch((error) => {
        console.log(error);
        response.json({ error });
      });
  });
//update a game
router.put('/:id', (request, response) => {
    const { id } = request.params
    const { info } = request.body
    console.log(body)
    db.none(
        `UPDATE game SET num_players = $1 WHERE id = $2 `, ([info], [id])
    )
      .then((results) => response.json(results))
      .catch((error) => {
        console.log(error);
        response.json({ error });
      });
  });
//delete a game


module.exports = router;
