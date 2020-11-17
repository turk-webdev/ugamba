const db = require('../db');

const updateSingleQuery = (table, [colsToUpdate], [values], col, query) => {
    if (colsToUpdate.length != values) {
        throw 'Incorrect usage of function - cols & queries/values must have equal number of entries';
    }

    let sql = `UPDATE ${table} SET `;
    for (let i=0; i<colsToUpdate.length; i++) {
        if (i>0) {
            sql.concat(`, `);
        }
        sql.concat(`${colsToUpdate[i]} = ${values[i]}`);
    }
    sql.concat(`WHERE ${col} = ${query}`);

    return db.none(sql);
};

const updateMultiQuery = (table, [colsToUpdate], [values], [cols], [queries]) => {
    if (colsToUpdate.length != values || cols.length != queries.length) {
        throw 'Incorrect usage of function - cols & queries/values must have equal number of entries';
    }

    let sql = `UPDATE ${table} SET `;
    for (let i=0; i<colsToUpdate.length; i++) {
        if (i>0) {
            sql.concat(`, `);
        }
        sql.concat(`${colsToUpdate[i]} = ${values[i]}`);
    }
    sql.concat(`WHERE `);
    for (let i=0; i<cols.length; i++) {
        if (i>0) {
            sql.concat(` AND `);
        }
        sql.concat(`${cols[i]} = ${queries[i]}`);
    }

    return db.none(sql);
};

module.exports = {
    updateSingleQuery,
    updateMultiQuery
};