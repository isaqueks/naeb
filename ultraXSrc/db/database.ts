import DatabaseManager from './databaseManager';

const SQLiteDatabase = DatabaseManager('./db.sqlite3');

export { DatabaseManager, SQLiteDatabase }