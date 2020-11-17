/** **************************************************************
 * SFSU CSC 667 - Team UGAMBA - M2 - Backend Heroku Deployment
 * George Freedland, Ufkun Erdin, Francis Cruz, Adam Bea
 *
 * Connecting to a sample db made in postgreSQL v.13
 *
 * heroku link: https://calm-castle-35028.herokuapp.com/
 * https://github.com/sfsu-csc-667-fall-2020-roberts/term-project-bea-erdin-freedland-cruz
 *************************************************************** */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession = require('express-session');
const { QueryFile } = require('pg-promise');
const passport = require('passport');
const PostgresSqlStore = require('connect-pg-simple')(expressSession);

// Do a developement environment check
if (process.env.NODE_ENV === 'dev') {
  require('dotenv').config();
}

const db = require('./db');

// Initialize session table
const fullPath = path.join(__dirname, './sql/initSession.sql'); // generating full path;
db.any(new QueryFile(fullPath, { minify: true })).then(() => {
  console.log('Initialized session table');
});

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testsRouter = require('./routes/tests');
const apiRouter = require('./routes/api');

const gameRouter = require('./routes/game');

// Instantiate the app
const app = express();

app.use(
  expressSession({
    store: new PostgresSqlStore({ conString: process.env.DATABASE_URL }),
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tests', testsRouter);
app.use('/api', apiRouter);
app.use('/game', gameRouter);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
// next(createError(404));
// });

// error handler
app.get('*', (req, res) => {
  console.log('req.user => ', req.user);
  res.render('error');
});

module.exports = app;
