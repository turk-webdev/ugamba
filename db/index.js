const initOptions = {};
const pgp = require('pg-promise')(initOptions);

const connection = pgp(process.env.DATABASE_URL);

module.exports = connection;
