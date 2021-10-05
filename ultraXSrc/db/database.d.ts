import DatabaseManager from './databaseManager';
declare const SQLiteDatabase: {
    db: any;
    promise: (query: string, params?: any) => Promise<any[]>;
};
export { DatabaseManager, SQLiteDatabase };
