const User = require('../classes/user');
const { hashPassword } = require('../utils');

exports.register = async (req, res) => {
  const { password, username } = req.body;
  if (!req.isUnauthenticated()) {
    res.redirect('/');
  }
  if (!username || !password) {
    return res.status(422).send({ error: 'Must provide email and password' });
  }
  const hashedPassword = hashPassword(password);
  const newUser = new User(undefined, username, hashedPassword, 1000);

  newUser
    .save()
    .then((results) => {
      if (!results) {
        return res.render('index', {
          error: 'Username is already taken',
          type: 'signup',
        });
      }
      req.login(results, (err) => {
        if (err) {
          return res.render('index', {
            error: 'Username is already taken',
            type: 'signup',
          });
        }
        res.redirect('/');
      });
    })
    .catch(() => {
      return res.render('index', {
        error: 'Username is already taken',
        type: 'signup',
      });
    });
};

exports.login = async (req, res) => {
  const { password, username } = req.body;
  if (!req.isUnauthenticated()) {
    res.redirect('/');
  }

  if (!username || !password) {
    return res.render('index', {
      error: 'Must provide username and password',
      type: 'login',
    });
  }

  User.findOneByUsername(username)
    .then((user) => {
      if (!user) {
        return res.render('index', {
          error: 'Invalid username or password',
          type: 'login',
        });
      }

      req.login(user, (err) => {
        if (err) {
          return res.render('index', {
            error: 'Invalid username or password',
            type: 'login',
          });
        }
        res.redirect('/');
      });
    })
    .catch(() => {
      return res.render('index', {
        error: 'Invalid password or email',
        type: 'login',
      });
    });
};
