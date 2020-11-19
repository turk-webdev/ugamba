const db = require('../db');

const updateExact = (table, colsToUpdate, values, col, query) => {
    let sql = 'UPDATE $1 ';
    let params = [table];
    let set = 'SET ', where = 'WHERE ';
    let count = 2;

    if (Array.isArray(colsToUpdate) && Array.isArray(values)) {
        if (colsToUpdate.length != values.length) {
            throw 'ERROR - colsToUpdate & values array length different';
        }

        for (let i=0; i<colsToUpdate.length; i++) {
            if (i>0) {
                set.concat(', ');
            }
            params.push(colsToUpdate[i]);
            params.push(values[i]);
            set.concat(`$${count} = $${count+1}`);
            count += 2;
        }
        
    }

    if (Array.isArray(col) && Array.isArray(query)) {
        if (col.length != query.length) {
            throw 'ERROR - col & query array length different';
        }

        for (let i=0; i<col.length; i++) {
            if (i>0) {
                set.concat(', ');
            }
            params.push(col[i]);
            params.push(query[i]);
            where.concat(`$${count} = $${count+1}`);
            count += 2;
        }
        
    }

    sql.concat(set);
    sql.concat(where);


    return db.none(sql, params);
};

const updateLike = (table, colsToUpdate, values, col, query) => {
    let sql = 'UPDATE $1 ';
    let params = [table];
    let set = 'SET ', where = 'WHERE ';
    let count = 2;

    if (Array.isArray(colsToUpdate) && Array.isArray(values)) {
        if (colsToUpdate.length != values.length) {
            throw 'ERROR - colsToUpdate & values array length different';
        }

        for (let i=0; i<colsToUpdate.length; i++) {
            if (i>0) {
                where.concat(', ');
            }
            params.push(colsToUpdate[i]);
            params.push(values[i]);
            set.concat(`$${count} = $${count+1}`);
            count += 2;
        }
        
    }

    if (Array.isArray(col) && Array.isArray(query)) {
        if (col.length != query.length) {
            throw 'ERROR - col & query array length different';
        }

        for (let i=0; i<col.length; i++) {
            if (i>0) {
                where.concat(', ');
            }
            params.push(col[i]);
            params.push(query[i]);
            where.concat(`$${count} LIKE $${count+1}`);
            count += 2;
        }
        
    }

    sql.concat(set);
    sql.concat(where);


    return db.none(sql, params);
};

module.exports = {
    updateExact
};