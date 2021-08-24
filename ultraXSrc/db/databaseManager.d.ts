export default function Database(dbFile: any): {
    db: any;
    runSql: (query: string, params?: Array<any>, callback?: Function) => void;
    getSql: (query: string, params?: Array<any>, callback?: Function) => void;
    allSql: (query: string, params?: Array<any>, callback?: Function) => void;
    Select: (query: string, params?: Array<any>, callback?: Function) => void;
    promise: (query: string, params?: Array<any> | any) => Promise<any[]>;
};
