import DatabaseManager from './databaseManager';
declare const database: {
    db: any;
    runSql: (query: string, params?: any[], callback?: Function) => void;
    getSql: (query: string, params?: any[], callback?: Function) => void;
    allSql: (query: string, params?: any[], callback?: Function) => void;
    Select: (query: string, params?: any[], callback?: Function) => void;
    promise: (query: string, params?: any) => Promise<any[]>;
};
export { DatabaseManager, database };
