const db = require('../db');

const insert = (table, cols, values) => {
  if (cols.length !== values.length) {
    throw new Error(
      'Incorrect usage of function - cols & queries must have equal number of entries',
    );
  }

  return db.none(
    `INSERT INTO ${table} (${cols.toString()}) VALUES (${values.toString()})`,
  );
};

const insertIdOnly = (table, returning) => {
  if (returning !== undefined) {
    return db.one(`INSERT INTO ${table} DEFAULT VALUES RETURNING ${returning}`);
  }
  return db.none(`INSERT INTO ${table} DEFAULT VALUES`);
};

module.exports = {
  insert,
  insertIdOnly,
};
