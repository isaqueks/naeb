import PowerSQL from "../../powersql/src/powerSql";
import PowerSQLDefaults from "../../powersql/src/powerSqlDefaults";
import { PowerSQLTable, PowerSQLTableColumn } from "../../powersql/src/table";
import DbInterface from "./dbInterface";
import Field from "./Field";
import ObjectData from "./ObjectData";
import ObjectModel from "./ObjectModel";
import ValuableField from "./ValuableField";

class CrudModel<T> {

    model: ObjectModel;
    database: DbInterface;
    table: PowerSQLTable;

    private getPowerSqltable(tableName: string): PowerSQLTable {
        const columns: PowerSQLTableColumn[] = [];
        for (let field of this.model.fields) {
            columns.push(
                new PowerSQLTableColumn(field.name, field.sqlType, field.sqlAttributes)
            );
        }

        return new PowerSQLTable(tableName, columns);
    }

    constructor(database: DbInterface, model: ObjectModel, tableName: string) {
        this.database = database;
        this.model = model;
        this.table = this.getPowerSqltable(tableName);
    }

    async createTableIfNotExists() {
        return await this.database.promise(
            PowerSQL(
                PowerSQLDefaults.createTable(this.table)
            )
        );
    }

    async getMultipleObjectData(searchKeys: any): Promise<ObjectData[]> {
        const sql = PowerSQL(
            PowerSQLDefaults.selectObject(
                this.table,
                searchKeys,
            )
        );

        const result = await this.database.promise(sql);
        if (!result || result.length == 0) {
            return [];
        }

        const resultMultipleObjectData: ObjectData[] = [];

        for (let objResult of result) {
            const objData = new ObjectData([]);

            for (let fieldName in objResult) {
                const modelField: Field = this.model.getField(fieldName);
                if (!modelField) {
                    continue;
                }
                
                const value = objResult[fieldName];
                const vField = new ValuableField(fieldName, modelField.sqlType, modelField.sqlAttributes, value);
                objData.fields.push(vField);
            }

            resultMultipleObjectData.push(objData);
        }

        return resultMultipleObjectData;
    }

    /**
     * ! Will throw an error if it returns more than one row !
     */
    async getSingleObjectData(searchKeys: any): Promise<ObjectData> {

        const result = await this.getMultipleObjectData(searchKeys);
        if (result.length == 0) {
            return null;
        }
        if (result.length > 1) {
            throw new Error(`Only one row expected! ${result.length} received!`);
        }
        return result[0];
    }

    async getMultiple(searchKeys: any): Promise<T[]> {
        const array = await this.getMultipleObjectData(searchKeys);
        const multipleData: T[] = [];

        array.forEach(item => multipleData.push(item.as<T>()))

        return multipleData;
    }

    async get(searchKeys: any): Promise<T> {
        const singleData = await this.getSingleObjectData(searchKeys);
        if (!singleData) {
            return null;
        }

        return singleData.as<T>();
    }

    protected getModelPrimaryKey(): Field {

        for (let field of this.model.fields) {
            for (let attr of field.sqlAttributes) {
                if (attr.toUpperCase() === 'PRIMARY KEY') {
                    return field;
                }
            }
        }

        return null;
    }

    protected async checkOrRemovePKColumnAndThrowError(data: ObjectData): Promise<void> {
        const pk: Field = this.getModelPrimaryKey();
        if (pk) {
            const valuablePkField = data.getField(pk.name) as ValuableField;

            if (valuablePkField.get()) {
                const dataWithPk = await this.getMultiple({ [pk.name]: valuablePkField.get() });
                if (dataWithPk.length > 0) {
                    throw new Error(`Could not insert data with PRIMARY KEY field set to ${valuablePkField.get()}`
                    + ` because there is already data with that PK!`);
                }
            }
            else {
                data.fields = data.fields.filter(f => f.name !== pk.name);
            }
        }
    }

    async insertData(data: ObjectData, checkForDuplicateData: boolean = true): Promise<void> {

        if (checkForDuplicateData) {
            await this.checkOrRemovePKColumnAndThrowError(data);
        }

        return await this.database.promise(
            PowerSQL(
                PowerSQLDefaults.insertInto(this.table, data.as<any>())
            )
        );
    }

    async insertMultipleData(data: ObjectData[], checkForDuplicate: boolean = true) {
        for(let dataObj of data) {
            await this.insertData(dataObj, checkForDuplicate);
        }
    }

    async insert(data: T, checkForDuplicateData: boolean = true): Promise<void> {
        return await this.insertData(ObjectData.from(this.model, data), checkForDuplicateData);
    }

    async insertMultiple(data: T[], checkForDuplicate: boolean = true) {
        for(let dataObj of data) {
            await this.insert(dataObj, checkForDuplicate);
        }
    }

    protected mountWhere(searchKeys: any): string {
        let deleteCond = [];
        for (let key in searchKeys) {
            let field = this.model.getField(key);
            if (!field) {
                continue;
            }
            let value = searchKeys[key];
            deleteCond.push(
                PowerSQLDefaults.equal(
                    field.name,
                    PowerSQLDefaults.param(
                        value,
                        field.sqlType
                    )
                )
            )
        }

        return PowerSQLDefaults.where(
            PowerSQLDefaults.group(
                deleteCond.join(' AND ')
            )
        )
    }

    async delete(searchKeys: any): Promise<void> {
        
        return await this.database.promise(
            PowerSQL(
                'DELETE',
                PowerSQLDefaults.from(this.table),
                this.mountWhere(searchKeys)
            )
        );
    }

    async deleteMultiple(searchKeys: any[]): Promise<void> {
        for (let key of searchKeys) {
            await this.delete(key);
        }
    }

    async deleteExactly(item: T): Promise<void> {
        return await this.delete(item);
    }

    async deleteMultipleExactly(items: T[]): Promise<void> {
        for (let item of items) {
            await this.deleteExactly(item);
        }
    }

    async update(searchKeys: any, dataToUpdate: any): Promise<void> {
        if (!dataToUpdate) {
            throw new Error('dataToUpdate expected!');
        }
        await this.database.promise(
            PowerSQL(
                PowerSQLDefaults.update(this.table),
                PowerSQLDefaults.set(dataToUpdate),
                this.mountWhere(searchKeys),
            )
        );
    }

}

export default CrudModel;