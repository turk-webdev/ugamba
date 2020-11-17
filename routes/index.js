const express = require('express');

const router = express.Router();

// Routes
router.get('/', (req, res) => {
  if (req.isUnauthenticated()) {
    res.render('index', { user: req.user });
  } else {
    res.render('authenticated/home', { user: req.user });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/register', (_, res) => {
  return res.render('register', { error: undefined });
});

router.get('/login', (req, res) => {
  if (req.isUnauthenticated()) {
    res.render('login', { error: undefined });
  } else res.redirect('authenticated/home');
});

module.exports = router;
