const jwt = require('jsonwebtoken');
const db = require('../models');

const { User } = db;

exports.register = async (req, res) => {
  const { password, username } = req.body;

  try {
    const newUser = new User({
      password,
      username,
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d',
    });

    return res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { password, username } = req.body;

  if (!username || !password) {
    return res.status(422).send({ error: 'Must provide email and password' });
  }

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(422).send({ error: 'Invalid password or email' });
  }
  try {
    user.comparePassword(password, user);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d',
    });
    return res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
};

exports.findOneById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ['password'] },
  });
  if (!user) {
    return res.status(400).send({ error: 'No user found' });
  }
  return res.send(user);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  //  TODO: Add any attributes that could be updated
  if (Number(id) !== req.user.dataValues.id) {
    return res
      .status(400)
      .send({ error: 'You do not have permissions to complete this action' });
  }
  const { username } = req.body;
  const user = await User.update(
    { username },
    {
      where: { id },
    },
  );
  if (!user) {
    return res.status(400).send({ error: 'No user found' });
  }
  return res.send({ message: 'User has been updated successfully' });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  // TODO: Add any attributes that could be updated
  if (Number(id) !== req.user.dataValues.id) {
    return res
      .status(400)
      .send({ error: 'You do not have permissions to complete this action' });
  }
  const { username } = req.body;
  const user = await User.update(
    { username },
    {
      where: { id },
    },
  );
  if (!user) {
    return res.status(400).send({ error: 'No user found' });
  }
  return res.send({ message: 'User has been deleted successfully' });
};
