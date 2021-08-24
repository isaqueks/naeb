"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const powerSqlStatement_1 = require("./powerSqlStatement");
const sqlTypes_1 = __importDefault(require("./sqlTypes"));
const table_1 = require("./table");
function _sqlCompare(...args) {
    if (!args || args.length != 2) {
        throw new Error(`2 arguments expected, ${args} received!`);
    }
    if (typeof args[0] === undefined) {
        throw new Error(`Arg 0 is undefined!`);
    }
    if (typeof args[1] === undefined) {
        throw new Error(`Arg 1 is undefined!`);
    }
    return args;
}
function _getArrayOfStringsExecutor(minLength = undefined, maxLength = undefined) {
    return function (...args) {
        if ((minLength !== undefined && args.length < minLength) ||
            (maxLength !== undefined && args.length > maxLength)) {
            throw new Error(`${minLength || 0} - ${maxLength} arguments expected! ${args.length} received!`);
        }
        return args;
    };
}
const select = powerSqlStatement_1.PowerSQLStatementFactory('SELECT $', (...args) => {
    const arr = ((!args || args.length === 0) ? ['*'] : args);
    return arr.join(', ');
});
const from = powerSqlStatement_1.PowerSQLStatementFactory('FROM $', (table) => {
    if (!table) {
        throw new Error('Invalid table!');
    }
    return table.name;
});
const update = powerSqlStatement_1.PowerSQLStatementFactory('UPDATE $', (table) => {
    if (!table) {
        throw new Error('Invalid table!');
    }
    return table.name;
});
const where = powerSqlStatement_1.PowerSQLStatementFactory('WHERE $', (whereCond) => {
    if (typeof whereCond !== 'string') {
        throw new Error(`string expected! ${typeof whereCond} (${whereCond}) received!`);
    }
    return whereCond;
});
const set = powerSqlStatement_1.PowerSQLStatementFactory('SET $', (modify) => {
    let code = [];
    if (!modify) {
        throw new Error('Cannot modify null!');
    }
    for (let column in modify) {
        let value = param(modify[column]);
        code.push(`${column} = ${value}`);
    }
    return code.join(', ');
});
const createTable = powerSqlStatement_1.PowerSQLStatementFactory('CREATE TABLE IF NOT EXISTS $ ($)', (table) => {
    let tableColumns = '';
    let i = 0;
    for (let column of table.columns) {
        const coma = (++i >= table.columns.length ? '' : ', ');
        let attrs = column.attributes;
        let attrsStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';
        tableColumns += `${column.name} ${column.type}${attrsStr}${coma}`;
    }
    return [table.name, tableColumns.trim()];
});
const insertInto = powerSqlStatement_1.PowerSQLStatementFactory('INSERT INTO $ ($) VALUES ($)', (table, objectToInsert, validate = true) => {
    if (!(table instanceof table_1.PowerSQLTable)) {
        throw new Error(`PowerSQLTable expected! ${typeof table} received!`);
    }
    if (typeof objectToInsert != 'object') {
        throw new Error(`Object expected! ${typeof objectToInsert} received!`);
    }
    let values = '';
    let sequence = '';
    let i = 0;
    for (let column of table.columns) {
        let val = objectToInsert[column.name];
        let upType = column.type.toUpperCase();
        if (upType.includes('(')) {
            upType = upType.substring(0, upType.indexOf('(')).trim();
        }
        if (val === undefined) {
            val = null;
        }
        if (validate) {
            let attrs = column.attributes.join(' ').toUpperCase();
            if (val === null && attrs.includes('NOT NULL')) {
                throw new Error(`Null received at column ${column.name} [${attrs}] (Table ${table.name})!`);
            }
            else if (val !== null) {
                const jsType = typeof val;
                const sqlType = sqlTypes_1.default.getSqlTypes(jsType);
                if (!sqlType) {
                    throw new Error(`Invalid type: ${jsType}!`);
                }
                if (sqlType.indexOf(upType) === -1) {
                    throw new Error(`Type conflict at ${column.name}! ${sqlType} expected, ${upType} (JS: ${jsType} ${val}) received!`);
                }
                val = param(val);
            }
            else if (val === null) {
                continue;
                // If val is NULL and Table accepts it, just ignore ...
            }
        }
        let coma = i > 0 ? ', ' : '';
        sequence += `${coma}${column.name}`;
        values += `${coma}${val}`;
        i++;
    }
    return [table.name, sequence.trim(), values.trim()];
});
const selectObject = powerSqlStatement_1.PowerSQLStatementFactory('SELECT * FROM $ WHERE $', (table, desiredObject) => {
    if (!table || !desiredObject) {
        throw new Error('Table and desired object expected!');
    }
    let whereConditions = [];
    for (let columnName in desiredObject) {
        const columnValue = desiredObject[columnName];
        const column = table.getColumn(columnName);
        if (!table) {
            throw new Error(`Column "${columnName}" does not exists at table ${table.name}!`);
        }
        whereConditions.push(equal(column.name, param(columnValue, column.type)));
    }
    return [table.name, whereConditions.join(' AND ')];
});
const equal = powerSqlStatement_1.PowerSQLStatementFactory('$ = $', _sqlCompare);
const notEqual = powerSqlStatement_1.PowerSQLStatementFactory('$ <> $', _sqlCompare);
const higher = powerSqlStatement_1.PowerSQLStatementFactory('$ > $', _sqlCompare);
const lower = powerSqlStatement_1.PowerSQLStatementFactory('$ < $', _sqlCompare);
const higherEqual = powerSqlStatement_1.PowerSQLStatementFactory('$ >= $', _sqlCompare);
const lowerEqual = powerSqlStatement_1.PowerSQLStatementFactory('$ <= $', _sqlCompare);
const like = powerSqlStatement_1.PowerSQLStatementFactory('$ LIKE $', _sqlCompare);
const and = powerSqlStatement_1.PowerSQLStatementFactory('AND $', _getArrayOfStringsExecutor(1, 1));
const or = powerSqlStatement_1.PowerSQLStatementFactory('OR $', _getArrayOfStringsExecutor(1, 1));
const group = powerSqlStatement_1.PowerSQLStatementFactory('($)', (...args) => {
    if (!args || args.length <= 0) {
        throw new Error(`At least 1 arg expected!`);
    }
    return args.join(' ');
});
const param = powerSqlStatement_1.PowerSQLStatementFactory('$', (...args) => {
    const [paramValue, paramSQLType] = args;
    let jsType;
    if (paramSQLType) {
        jsType = sqlTypes_1.default.getJsType(paramSQLType);
    }
    else {
        jsType = typeof (paramValue);
    }
    return sqlTypes_1.default.sqlEscapeToString(paramValue, jsType);
});
// const PowerSQLDefaults = {
// 	select: _selectStatement,
// 	where: _whereStatement,
//     insertInto: _insertInto,
//     createTable: _createTable,
// 	equal: _equalOperator,
// 	notEqual: _notEqualOperator,
// 	higher: _higherOperator,
// 	lower: _lowerOperator,
// 	higherOrEqual: _highOrEqualOperator,
// 	lowerOrEqual: _lowerOrEqualOperator,
//     like: _likeOperator,
// 	and: _sqlAndOperator,
// 	or: _sqlOrOperator,
// 	group: _sqlGroup
// }
// export default PowerSQLDefaults;
const PowerSQLDefaults = {
    select,
    where,
    from,
    insertInto,
    createTable,
    selectObject,
    update,
    set,
    equal,
    notEqual,
    higher,
    lower,
    higherEqual,
    lowerEqual,
    like,
    and,
    or,
    group,
    param
};
exports.default = PowerSQLDefaults;
