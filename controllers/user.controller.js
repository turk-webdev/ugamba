const jwt = require('jsonwebtoken');
const db = require('../db');
// const db = require('../models');
const { hashPassword, comparePassword } = require('../utils');

exports.register = async (req, res) => {
  const { password, username } = req.body;
  if (!username || !password) {
    return res.status(422).send({ error: 'Must provide email and password' });
  }
  const hashedPassword = hashPassword(password);
  db.any(
    `INSERT INTO users (id, username, password) VALUES (DEFAULT, '${username}', '${hashedPassword}') ON CONFLICT DO NOTHING RETURNING id,username;`,
  )
    .then((results) => {
      if (results.length === 0) {
        return res
          .status(422)
          .send({ error: 'User with username already exists' });
      }
      return res.send(results);
    })
    .catch((error) => {
      console.log(error);
      res.status(422).send({ error });
    });
};

exports.login = async (req, res) => {
  const { password, username } = req.body;

  if (!username || !password) {
    return res.status(422).send({ error: 'Must provide email and password' });
  }

  db.one(
    `SELECT id, username, password FROM users AS U WHERE U.username = '${username}'`,
  )
    .then((user) => {
      if (!user) {
        return res.status(422).send({ error: 'Invalid password or email' });
      }

      comparePassword(password, user);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d',
      });
      return res.send({ token });
    })
    .catch((err) => {
      return res.status(422).send({ error: err.message });
    });
};

exports.findOneById = async (req, res) => {
  const { id } = req.params;
  db.one(`SELECT id, username FROM users AS U WHERE U.id = ${id}`).then(
    (results) => {
      if (!results) {
        return res.status(400).send({ error: 'No user found' });
      }
      return res.send(results);
    },
  );
};

exports.update = async (req, res) => {
  const { id } = req.params;
  //  TODO: Add any attributes that could be updated
  const { username } = req.body;
  if (Number(id) !== req.user.id) {
    return res
      .status(400)
      .send({ error: 'You do not have permissions to complete this action' });
  }

  db.none(`UPDATE users SET username= '${username}' WHERE id= ${id};`)
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
  db.none(`DELETE FROM users WHERE id=${id}`)
    .then(() => {
      return res.send({ message: 'User has been deleted successfully' });
    })
    .catch(() => {
      return res.status(400).send({ error: 'No user found' });
    });
};
