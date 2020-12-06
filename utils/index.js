const crypto = require('crypto');

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

const PlayerActions = {
  CHECK: 'check',
  BET: 'bet',
  CALL: 'call',
  RAISE: 'raise',
  FOLD: 'fold',
  LEAVE: 'leave',
  RESET: 'reset',
};

module.exports = {
  comparePassword,
  hashPassword,
  PlayerActions,
};
