const db = require('../db');

const insert = (table, [cols], [values]) => {
    if (cols.length != values.length) {
        throw 'Incorrect usage of function - cols & queries must have equal number of entries';
    }

    return await db.none(`INSERT INTO ${table} (${cols.toString()}) VALUES (${values.toString})`);
};

module.exports = {
    insert
};