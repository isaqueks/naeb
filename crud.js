const { ObjectModel, Field, SimpleCrud } = require('ultrax');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('db.sqlite3');

const wrapper = {
    promise: (sql, params) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
}

const model = new ObjectModel([
    new Field('id', 'INTEGER', ['PRIMARY KEY']),
    new Field('name', 'TEXT'),
    new Field('age', 'INTEGER')
]);
const crud = new SimpleCrud(wrapper, model, 'testCrud');
crud.setup();

module.exports = { crud };