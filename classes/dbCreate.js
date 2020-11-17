const db = require('../db');

const insert = (table, [cols], [values]) => {
    if (cols.length != values.length) {
        throw 'Incorrect usage of function - cols & queries must have equal number of entries';
    }

    return db.none(`INSERT INTO ${table} (${cols.toString()}) VALUES (${values.toString})`);
};

const insertIdOnly = (table) => {
    return db.none(`INSERT INTO ${table} DEFAULT VALUES`);
};

module.exports = {
    insert,
    insertIdOnly
};