require('dotenv').config();


module.exports = {
  "development": {
    // "username": "root",
    // "password": null,
    // "database": "database_development",
    // "host": "127.0.0.1",
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres"
  },
  "test": {
    // "username": "root",
    // "password": null,
    // "database": "database_development",
    // "host": "127.0.0.1",
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres"
  },
  "production": {
    // "username": "root",
    // "password": null,
    // "database": "database_development",
    // "host": "127.0.0.1",
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres"
  }
}
