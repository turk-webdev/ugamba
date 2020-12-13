const initOptions = {
  query(e) {
    // eslint-disable-next-line no-console
    console.log(e.query);
  },
};
const pgp = require('pg-promise')(initOptions);

const connection = pgp(process.env.DATABASE_URL);

module.exports = connection;
