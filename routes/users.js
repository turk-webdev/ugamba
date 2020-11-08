const express = require('express');

const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const User = require('../controllers/user.controller.js');

/* GET users listing. */
router.post('/register', User.register);

router.post('/login', User.login);

router.get('/:id', requireAuth, User.findOneById);

router.patch('/:id', requireAuth, User.update);

router.delete('/:id', requireAuth, User.delete);

module.exports = router;
