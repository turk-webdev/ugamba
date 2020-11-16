const db = require('../db');


const findAll = (table) => {
    return db.any(`SELECT * FROM ${table}`);
};

const findAllBySingleQueryExact = (table, col, query) => {
    return db.any(`SELECT * FROM ${table} WHERE ${col} = ${query}`);
};

const findAllBySingleQueryLike = (table, col, query) => {
    return db.any(`SELECT * FROM ${table} WHERE ${col} LIKE ${query}`);
};

const findOneBySingleQueryExact = (table, col, query) => {
    return db.one(`SELECT * FROM ${table} WHERE ${col} = ${query}`);
};

const findOneBySingleQueryLike = (table, col, query) => {
    return db.one(`SELECT * FROM ${table} WHERE ${col} LIKE ${query}`);
};

const findOneByMultipleQueryExact = (table, [cols], [queries]) => {
    if (cols.length != queries.length)  {
        throw 'Incorrect usage of function - cols & queries must have equal number of entries';
    }
    let sql = `SELECT * FROM ${table} WHERE `;
    for (let i=0; i<cols.length; i++) {
        if (i>0) {
            sql.concat(` AND `);
        }
        sql.concat(`${cols[i]} = ${queries[i]}`);
    }
};

const findOneByMultipleQueryLike = (table, [cols], [queries]) => {
    if (cols.length != queries.length)  {
        throw 'Incorrect usage of function - cols & queries must have equal number of entries';
    }
    let sql = `SELECT * FROM ${table} WHERE `;
    for (let i=0; i<cols.length; i++) {
        if (i>0) {
            sql.concat(` AND `);
        }
        sql.concat(`${cols[i]} LIKE ${queries[i]}`);
    }
};



module.exports = {
    findAll,
    findAllBySingleQueryExact,
    findAllBySingleQueryLike,
    findOneBySingleQueryExact,
    findOneBySingleQueryLike,
    findOneByMultipleQueryExact,
    findOneByMultipleQueryLike
};