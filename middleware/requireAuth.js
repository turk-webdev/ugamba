const jwt = require('jsonwebtoken');
const db = require('../models');

const { User } = db;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === 'Bearer laksjdflaksdjasdfklj'

  if (!authorization) {
    return res
      .status(401)
      .send({ error: 'You must be logged in no auth header.' });
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'You must be logged in.' });
    }

    const { id } = payload;

    const user = await User.findOne({ where: { id } });
    req.user = user;
    next();
  });
};
