export default function Database(dbFile: any): {
    db: any;
    promise: (query: string, params?: Array<any> | any) => Promise<any[]>;
};
