"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const powerSql_1 = __importDefault(require("../../powersql/src/powerSql"));
const powerSqlDefaults_1 = __importDefault(require("../../powersql/src/powerSqlDefaults"));
const table_1 = require("../../powersql/src/table");
const ObjectData_1 = __importDefault(require("./ObjectData"));
const ValuableField_1 = __importDefault(require("./ValuableField"));
class CrudModel {
    constructor(database, model, tableName) {
        this.database = database;
        this.model = model;
        this.table = this.getPowerSqltable(tableName);
    }
    getPowerSqltable(tableName) {
        const columns = [];
        for (let field of this.model.fields) {
            columns.push(new table_1.PowerSQLTableColumn(field.name, field.sqlType, field.sqlAttributes));
        }
        return new table_1.PowerSQLTable(tableName, columns);
    }
    createTableIfNotExists() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.database.promise(powerSql_1.default(powerSqlDefaults_1.default.createTable(this.table)));
        });
    }
    getMultipleObjectData(searchKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = powerSql_1.default(powerSqlDefaults_1.default.selectObject(this.table, searchKeys));
            const result = yield this.database.promise(sql);
            if (!result || result.length == 0) {
                return [];
            }
            const resultMultipleObjectData = [];
            for (let objResult of result) {
                const objData = new ObjectData_1.default([]);
                for (let fieldName in objResult) {
                    const modelField = this.model.getField(fieldName);
                    if (!modelField) {
                        continue;
                    }
                    const value = objResult[fieldName];
                    const vField = new ValuableField_1.default(fieldName, modelField.sqlType, modelField.sqlAttributes, value);
                    objData.fields.push(vField);
                }
                resultMultipleObjectData.push(objData);
            }
            return resultMultipleObjectData;
        });
    }
    /**
     * ! Will throw an error if it returns more than one row !
     */
    getSingleObjectData(searchKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getMultipleObjectData(searchKeys);
            if (result.length == 0) {
                return null;
            }
            if (result.length > 1) {
                throw new Error(`Only one row expected! ${result.length} received!`);
            }
            return result[0];
        });
    }
    getMultiple(searchKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const array = yield this.getMultipleObjectData(searchKeys);
            const multipleData = [];
            array.forEach(item => multipleData.push(item.as()));
            return multipleData;
        });
    }
    get(searchKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const singleData = yield this.getSingleObjectData(searchKeys);
            if (!singleData) {
                return null;
            }
            return singleData.as();
        });
    }
    getModelPrimaryKey() {
        for (let field of this.model.fields) {
            for (let attr of field.sqlAttributes) {
                if (attr.toUpperCase() === 'PRIMARY KEY') {
                    return field;
                }
            }
        }
        return null;
    }
    checkOrRemovePKColumnAndThrowError(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const pk = this.getModelPrimaryKey();
            if (pk) {
                const valuablePkField = data.getField(pk.name);
                if (valuablePkField.get()) {
                    const dataWithPk = yield this.getMultiple({ [pk.name]: valuablePkField.get() });
                    if (dataWithPk.length > 0) {
                        throw new Error(`Could not insert data with PRIMARY KEY field set to ${valuablePkField.get()}`
                            + ` because there is already data with that PK!`);
                    }
                }
                else {
                    data.fields = data.fields.filter(f => f.name !== pk.name);
                }
            }
        });
    }
    insertData(data, checkForDuplicateData = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (checkForDuplicateData) {
                yield this.checkOrRemovePKColumnAndThrowError(data);
            }
            return yield this.database.promise(powerSql_1.default(powerSqlDefaults_1.default.insertInto(this.table, data.as())));
        });
    }
    insertMultipleData(data, checkForDuplicate = true) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let dataObj of data) {
                yield this.insertData(dataObj, checkForDuplicate);
            }
        });
    }
    insert(data, checkForDuplicateData = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.insertData(ObjectData_1.default.from(this.model, data), checkForDuplicateData);
        });
    }
    insertMultiple(data, checkForDuplicate = true) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let dataObj of data) {
                yield this.insert(dataObj, checkForDuplicate);
            }
        });
    }
    mountWhere(searchKeys) {
        let deleteCond = [];
        for (let key in searchKeys) {
            let field = this.model.getField(key);
            if (!field) {
                continue;
            }
            let value = searchKeys[key];
            deleteCond.push(powerSqlDefaults_1.default.equal(field.name, powerSqlDefaults_1.default.param(value, field.sqlType)));
        }
        return powerSqlDefaults_1.default.where(powerSqlDefaults_1.default.group(deleteCond.join(' AND ')));
    }
    delete(searchKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.database.promise(powerSql_1.default('DELETE', powerSqlDefaults_1.default.from(this.table), this.mountWhere(searchKeys)));
        });
    }
    deleteMultiple(searchKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let key of searchKeys) {
                yield this.delete(key);
            }
        });
    }
    deleteExactly(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delete(item);
        });
    }
    deleteMultipleExactly(items) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let item of items) {
                yield this.deleteExactly(item);
            }
        });
    }
    update(searchKeys, dataToUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dataToUpdate) {
                throw new Error('dataToUpdate expected!');
            }
            yield this.database.promise(powerSql_1.default(powerSqlDefaults_1.default.update(this.table), powerSqlDefaults_1.default.set(dataToUpdate), this.mountWhere(searchKeys)));
        });
    }
}
exports.default = CrudModel;
