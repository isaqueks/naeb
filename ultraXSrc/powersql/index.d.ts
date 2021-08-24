import PowerSQL from "./src/powerSql";
import { PowerSQLTable, PowerSQLTableColumn } from "./src/table";
declare const power: {
    PowerSQL: typeof PowerSQL;
    PowerSQLDefaults: {
        select: import("./src/powerSqlStatement").PowerSQLStatement;
        where: import("./src/powerSqlStatement").PowerSQLStatement;
        from: import("./src/powerSqlStatement").PowerSQLStatement;
        insertInto: import("./src/powerSqlStatement").PowerSQLStatement;
        createTable: import("./src/powerSqlStatement").PowerSQLStatement;
        selectObject: import("./src/powerSqlStatement").PowerSQLStatement;
        update: import("./src/powerSqlStatement").PowerSQLStatement;
        set: import("./src/powerSqlStatement").PowerSQLStatement;
        equal: import("./src/powerSqlStatement").PowerSQLStatement;
        notEqual: import("./src/powerSqlStatement").PowerSQLStatement;
        higher: import("./src/powerSqlStatement").PowerSQLStatement;
        lower: import("./src/powerSqlStatement").PowerSQLStatement;
        higherEqual: import("./src/powerSqlStatement").PowerSQLStatement;
        lowerEqual: import("./src/powerSqlStatement").PowerSQLStatement;
        like: import("./src/powerSqlStatement").PowerSQLStatement;
        and: import("./src/powerSqlStatement").PowerSQLStatement;
        or: import("./src/powerSqlStatement").PowerSQLStatement;
        group: import("./src/powerSqlStatement").PowerSQLStatement;
        param: import("./src/powerSqlStatement").PowerSQLStatement;
    };
    PowerSQLTypes: {
        getJsType: (sqlType: string) => string;
        getSqlTypes: (jsType: string) => string[];
        sqlEscapeToString: (value: any, jsType: any) => string;
    };
    PowerSQLTable: typeof PowerSQLTable;
    PowerSQLTableColumn: typeof PowerSQLTableColumn;
};
export default power;
