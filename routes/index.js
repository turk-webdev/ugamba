const express = require('express');

const router = express.Router();

const usersRouter = require('./users');
const testsRouter = require('./tests');
const apiRouter = require('./api');
const GamePlayer = require('../classes/game_player');
const requireAuth = require('../middleware/requireAuth');

// Redirect routes
router.use('/users', usersRouter);
router.use('/tests', testsRouter);
router.use('/api', requireAuth, apiRouter);

// Routes
router.get('/', (req, res) => {
  if (req.isUnauthenticated()) {
    res.render('index', { error: undefined, type: undefined });
  } else {
    let games = [];
    GamePlayer.findAllGamesByUserId(req.user.id)
      .then((result) => {
        games = games.concat(result);
        res.render('authenticated/home', {
          user: req.user,
          games,
        });
      })
      .catch((e) => {
        console.log('error in auth home => ', e);
      });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
