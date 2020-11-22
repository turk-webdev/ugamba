const crypto = require('crypto');
const debug = require('debug')('ugamba-backend:server');

const hashPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  return sha256.update(password).digest('base64');
};

const comparePassword = (candidatePassword, user) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(candidatePassword).digest('base64');
  if (user.password !== hash) {
    throw new Error('Invalid password or email');
  }
};

module.exports = {
  comparePassword,
  hashPassword,
};
