const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  });
  User.beforeSave((user) => {
    if (!user.changed('password')) {
      return;
    }
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(user.password).digest('base64');

    user.password = hash;
  });
  // User.associate = function (models) {};
  User.prototype.comparePassword = (candidatePassword, user) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(candidatePassword).digest('base64');
    if (user.password !== hash) {
      throw new Error('Invalid password or email');
    }
  };
  return User;
};
