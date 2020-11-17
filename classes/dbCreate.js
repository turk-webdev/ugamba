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



module.exports = {
    findAll,
    findAllBySingleQueryExact,
    findAllBySingleQueryLike,
    findOneBySingleQueryExact,
    findOneBySingleQueryLike
};