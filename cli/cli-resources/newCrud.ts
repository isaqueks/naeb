import MyEntity from './entityPath';
import { ObjectModel, Field, SimpleCrud, SQLiteDatabase } from 'naeb';

const __NAME__Model = new ObjectModel([
    new Field('id', 'INTEGER', ['PRIMARY KEY', 'AUTOINCREMENT']),
]);

const __NAME__Crud = new SimpleCrud<MyEntity>(SQLiteDatabase, __NAME__Model, '__NAME__');
__NAME__Crud.createTableIfNotExists();

export default __NAME__Crud;