import DatabaseManager from './databaseManager';

const database = DatabaseManager('./db.sqlite3');

export { DatabaseManager, database }