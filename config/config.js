require('dotenv').config();

module.exports = {
<<<<<<< HEAD
 "development": {
 "use_env_variable": "DATABASE_URL",
 "dialect": "postgres"
 },
 "test": {
 "use_env_variable": "DATABASE_URL",
 "dialect": "postgres"
 },
 "production": {
 "use_env_variable": "DATABASE_URL",
 "dialect": "postgres"
 }
}
=======
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
    quoteIdentifiers: false,
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
    quoteIdentifiers: false,
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
    quoteIdentifiers: false,
  },
};
>>>>>>> b9486b0c06ba8f08bb7cd422e3be90736bc4e09b
