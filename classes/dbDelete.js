const db = require('../db');

const removeSingleQueryExact = (table, col, query) => {
    return db.none(`DELETE FROM $1 WHERE $2 = $3`,[table,col,query]);
};

const removeMultiQueryExact = (table, [cols], [queries]) => {
    if (cols.length != values.length) {
        throw 'Incorrect usage of function - cols & queries must have equal number of entries';
    }

    let sql = `DELETE FROM ${table} WHERE `;
    for (let i=0; i<cols.length; i++) {
        if (i>0) {
            sql.concat(` AND `);
        }
        sql.concat(`${cols[i]} = ${queries[i]}`);
    }
    return db.none(sql);
};

const removeSingleQueryLike = (table, col, query) => {
    return db.none(`DELETE FROM $1 WHERE $2 LIKE $3`,[table,col,query]);
};

const removeMultiQueryLike = (table, [cols], [queries]) => {
    if (cols.length != values.length) {
        throw 'Incorrect usage of function - cols & queries must have equal number of entries';
    }

    let sql = `DELETE FROM ${table} WHERE `;
    for (let i=0; i<cols.length; i++) {
        if (i>0) {
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
    removeMultiQueryLike
};