import { PowerSQLTable } from "../../powersql/src/table";
import DbInterface from "./dbInterface";
import Field from "./Field";
import ObjectData from "./ObjectData";
import ObjectModel from "./ObjectModel";
declare class CrudModel<T> {
    model: ObjectModel;
    database: DbInterface;
    table: PowerSQLTable;
    private getPowerSqltable;
    constructor(database: DbInterface, model: ObjectModel, tableName: string);
    createTableIfNotExists(): Promise<any>;
    getMultipleObjectData(searchKeys: any): Promise<ObjectData[]>;
    /**
     * ! Will throw an error if it returns more than one row !
     */
    getSingleObjectData(searchKeys: any): Promise<ObjectData>;
    getMultiple(searchKeys: any): Promise<T[]>;
    get(searchKeys: any): Promise<T>;
    protected getModelPrimaryKey(): Field;
    protected checkOrRemovePKColumnAndThrowError(data: ObjectData): Promise<void>;
    insertData(data: ObjectData, checkForDuplicateData?: boolean): Promise<void>;
    insertMultipleData(data: ObjectData[], checkForDuplicate?: boolean): Promise<void>;
    insert(data: T, checkForDuplicateData?: boolean): Promise<void>;
    insertMultiple(data: T[], checkForDuplicate?: boolean): Promise<void>;
    protected mountWhere(searchKeys: any): string;
    delete(searchKeys: any): Promise<void>;
    deleteMultiple(searchKeys: any[]): Promise<void>;
    deleteExactly(item: T): Promise<void>;
    deleteMultipleExactly(items: T[]): Promise<void>;
    update(searchKeys: any, dataToUpdate: any): Promise<void>;
}
export default CrudModel;
