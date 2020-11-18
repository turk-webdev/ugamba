// const initOptions = {
//     query(e) {
//         console.log(e.query);
//     },
// };

// const pgp = require('pg-promise')(initOptions);
const pgp = require('pg-promise')();

const connection = pgp(process.env.DATABASE_URL);

module.exports = connection;
