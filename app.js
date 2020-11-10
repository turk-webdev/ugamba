/** **************************************************************
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
const expressSession = require('express-session');
const passport = require('passport');

// Do a developement environment check
if (process.env.NODE_ENV === 'dev') {
  require('dotenv').config();
}

// Routes
// const indexRouter = require('./routes/index');
const usersRouter = require('./src/routes/users');
const testsRouter = require('./src/routes/tests');

// Instantiate the app
const app = express();

app.use(
  expressSession({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SECRET_KEY,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, '/views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.get('/', (req, res) => {
  console.log('req.user => ', req.user);
  res.render('index', { user: req.user });
});

app.get('/logout', (req, res) => {
  console.log('it got to lgout');
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

app.use('/', usersRouter);
app.use('/tests', testsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('res.locals.message=> ', res.locals.message);
  res.render('error');
});

module.exports = app;
