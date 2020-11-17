const db = require('../db');


const findAll = (table) => {
    return db.any(`SELECT * FROM $1`,[table]);
};

const findAllBySingleQueryExact = (table, col, query) => {
    return db.any(`SELECT * FROM $1 WHERE $2 = $3`,[table,col,query]);
};

const findAllBySingleQueryLike = (table, col, query) => {
    return db.any(`SELECT * FROM $1 WHERE $2 LIKE $3`,[table,col,query]);
};

const findAllByMultipleQueryExact = (table, cols, queries) => {
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
    return db.any(sql);
};

const findAllByMultipleQueryLike = (table, cols, queries) => {
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
    return db.any(sql);
};

const findOneBySingleQueryExact = (table, col, query) => {
    return db.one(`SELECT * FROM $1 WHERE $2 = $3`,[table,col,query]);
};

const findOneBySingleQueryLike = (table, col, query) => {
    return db.one(`SELECT * FROM $1 WHERE $2 LIKE $3`,[table,col,query]);
};

const findOneByMultipleQueryExact = (table, cols, queries) => {
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
    return db.one(sql);
};

const findOneByMultipleQueryLike = (table, cols, queries) => {
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
    return db.one(sql);
};



module.exports = {
    findAll,
    findAllBySingleQueryExact,
    findAllBySingleQueryLike,
    findOneBySingleQueryExact,
    findOneBySingleQueryLike,
    findOneByMultipleQueryExact,
    findOneByMultipleQueryLike,
    findAllByMultipleQueryExact,
    findAllByMultipleQueryLike
};