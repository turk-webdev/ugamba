const db = require('../db');

const updateExact = (table, colsToUpdate, values, col, query) => {
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

const updateLike = (table, colsToUpdate, values, col, query) => {
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
    sql.concat(`WHERE ${col} LIKE ${query}`);

    return db.none(sql);
};

module.exports = {
    updateExact,
    updateLike
};