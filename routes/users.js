const express = require('express');

const router = express.Router();
const User = require('../controllers/user.controller.js');
const passport = require('../passport/index'); // eslint-disable-line no-unused-vars

/* GET users listing. */
router.post('/register', User.register);

router.post('/login', User.login);

module.exports = router;
