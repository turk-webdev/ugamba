const express = require('express');

const router = express.Router();
const db = require('../db');
const Game = require('../controllers/game.controller.js');

//new routes with controllers

router.post('/', Game.create);
router.get('/', Game.findAll);
router.get('/:id', Game.findById);
router.put('/:id', Game.update);
router.delete('/:id', Game.delete);



module.exports = router;
