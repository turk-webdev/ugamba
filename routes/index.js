const express = require('express');
const router = express.Router();

const apiRouter = require('./api');


// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
