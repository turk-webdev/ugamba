const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const User = require('../classes/user');
const { hashPassword } = require('../utils');

const comparePassword = (candidatePassword, user) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(candidatePassword).digest('base64');
  if (user.password !== hash) {
    throw new Error('Invalid password or email');
  }
};

passport.use(
  'local',
  new LocalStrategy((username, password, done) => {
    User.findOneByUsername(username)
      .then((user) => {
        if (!user) {
          return done(null, false, {});
        }
        comparePassword(password, user);
        return done(null, user);
      })
      .catch((err) => {
        return done(err);
      });
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOneById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

module.exports = passport;
