const express = require('express');

const router = express.Router();
const User = require('../controllers/user.controller.js');
const passport = require('../passport/index'); // eslint-disable-line no-unused-vars

/* GET users listing. */
router.post('/register', User.register);

router.post('/login', User.login);

// router.get('/:id', User.findOneById);

// router.patch('/:id', User.update);
//
// router.delete('/:id', User.delete);

module.exports = router;
