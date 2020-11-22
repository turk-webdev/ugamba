const db = require('../db');

const removeSingleQueryExact = (table, col, query) => {
  return db.none(`DELETE FROM ${table} WHERE ${col} = ${query}`);
};

const removeMultiQueryExact = (table, cols, queries) => {
  if (cols.length !== queries.length) {
    throw new Error(
      'Incorrect usage of function - cols & queries must have equal number of entries',
    );
  }

  const sql = `DELETE FROM ${table} WHERE `;
  for (let i = 0; i < cols.length; i++) {
    if (i > 0) {
      sql.concat(` AND `);
    }
    sql.concat(`${cols[i]} = ${queries[i]}`);
  }
  return db.none(sql);
};

const removeSingleQueryLike = (table, col, query) => {
  return db.none(`DELETE FROM ${table} WHERE ${col} LIKE ${query}`);
};

const removeMultiQueryLike = (table, [cols], [queries]) => {
  if (cols.length !== queries.length) {
    throw new Error(
      'Incorrect usage of function - cols & queries must have equal number of entries',
    );
  }

  const sql = `DELETE FROM ${table} WHERE `;
  for (let i = 0; i < cols.length; i++) {
    if (i > 0) {
      sql.concat(` AND `);
    }
    sql.concat(`${cols[i]} LIKE ${queries[i]}`);
  }
  return db.none(sql);
};

module.exports = {
  removeSingleQueryExact,
  removeMultiQueryExact,
  removeSingleQueryLike,
  removeMultiQueryLike,
};
