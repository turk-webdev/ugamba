require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    password: 'ugamba',
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    password: 'ugamba',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    password: 'ugamba',
  },
};
