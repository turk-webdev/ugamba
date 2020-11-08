require('dotenv').config();

module.exports = {
  dev: {
    // username: "fcruz",
    // password: null,
    // database: "develpment",
    // host: "127.0.0.1",
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    define: {
      timestamps: false,
    },
  },
  test: {
    // "username": "root",
    // "password": null,
    // "database": "database_development",
    // "host": "127.0.0.1",
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    define: {
      timestamps: false,
    },
  },
  production: {
    // "username": "root",
    // "password": null,
    // "database": "database_development",
    // "host": "127.0.0.1",
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    define: {
      timestamps: false,
    },
  },
};
