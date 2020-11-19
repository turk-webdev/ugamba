const express = require('express');

const router = express.Router();

const usersRouter = require('./users');
const testsRouter = require('./tests');
const apiRouter = require('./api');

// Redirect routes
router.use('/users', usersRouter);
router.use('/tests', testsRouter);
router.use('/api', apiRouter);

// Routes
router.get('/', (req, res) => {
  if (req.isUnauthenticated()) {
    res.render('index', { error: undefined, type: undefined });
  } else {
    res.render('authenticated/home', { user: req.user });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

// router.get('/register', (_, res) => {
// return res.render('register', { error: undefined });
// });

// router.get('/login', (req, res) => {
// if (req.isUnauthenticated()) {
// res.render('login', { error: undefined });
// } else res.redirect('authenticated/home');
// });

module.exports = router;
