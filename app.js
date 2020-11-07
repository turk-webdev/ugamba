/****************************************************************
 * SFSU CSC 667 - Team UGAMBA - M2 - Backend Heroku Deployment
 * George Freedland, Ufkun Erdin, Francis Cruz, Adam Bea
 *
 * Connecting to a sample db made in postgreSQL v.13
 *
 * heroku link: https://calm-castle-35028.herokuapp.com/
 * https://github.com/sfsu-csc-667-fall-2020-roberts/term-project-bea-erdin-freedland-cruz
 ****************************************************************/
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Do a developement environment check
if (process.env.NODE_ENV === 'dev') {
  require('dotenv').config();
}

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testsRouter = require('./routes/tests');


// Instantiate the app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tests', testsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
