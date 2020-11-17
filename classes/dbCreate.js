const db = require('../db');

const insert = (table, cols, values) => {
    if (cols.length != values.length) {
        throw 'Incorrect usage of function - cols & queries must have equal number of entries';
    }

    return db.none(`INSERT INTO $1 ($2) VALUES ($3)`,[table,cols.toString(),values.toString()]);
};

const insertIdOnly = (table, returning) => {
    if (returning !== undefined) {
        return db.one(`INSERT INTO $1 DEFAULT VALUES RETURNING $2`,[table,returning]);
    } else {
        return db.none(`INSERT INTO $1 DEFAULT VALUES`,[table]);
    }
    
};

module.exports = {
    insert,
    insertIdOnly
};