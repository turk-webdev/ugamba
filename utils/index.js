const crypto = require('crypto');

exports.hashPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  return sha256.update(password).digest('base64');
};

exports.comparePassword = (candidatePassword, user) => {
  console.log('candidatePassword => ', candidatePassword);
  console.log('user => ', user.password);
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(candidatePassword).digest('base64');
  console.log('hashPassword => ', hash);
  if (user.password !== hash) {
    throw new Error('Invalid password or email');
  }
};
