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

exports.findOneById = async (req, res) => {
  const { id } = req.params;
  User.findOneById(id)
    .then((results) => {
      if (!results) {
        return res.status(400).send({ error: 'No user found' });
      }
      return res.send(results);
    })
    .catch(() => {
      return res.status(400).send({ error: 'No user found' });
    });
};
/*
exports.update = async (req, res) => {
const { id } = req.params;
//  TODO: Add any attributes that could be updated
const { username } = req.body;
if (Number(id) !== req.user.id) {
return res
.status(400)
.send({ error: 'You do not have permissions to complete this action' });
}

User.updateUsernameById(id, username)
.then(() => {
return res.send({ message: 'User has been updated successfully' });
})
.catch(() => {
return res.status(400).send({ error: 'No user found' });
});
};

exports.delete = async (req, res) => {
const { id } = req.params;

// TODO: Add any attributes that could be updated
if (Number(id) !== req.user.id) {
return res
.status(400)
.send({ error: 'You do not have permissions to complete this action' });
}
User.deleteById(id)
.then(() => {
return res.send({ message: 'User has been deleted successfully' });
})
.catch(() => {
return res.status(400).send({ error: 'No user found' });
});
}; */
