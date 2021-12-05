import { Crud, DbInterface, Field, ObjectData, ObjectModel, SimpleCrud, SQLCrud, ValuableField, VirtualTypes } from "genericcrud";
import { HTTPFunctionHandler } from "./naebSrc/api/httpFunctionHandler";
import HTTPRoute from "./naebSrc/api/httpRoute";
import HTTPRouteExecutor from "./naebSrc/api/httpRouteExecutor";
import HTTPRouteTemplate from "./naebSrc/api/httpTemplate";
import respondJSON from "./naebSrc/api/templates/respondJSON";
import respondPlain from "./naebSrc/api/templates/respondPlain";
import respondJSX from "./naebSrc/api/templates/respondJSX";
import RouteManager from "./naebSrc/routeManager";
import NAEBServer from "./naebSrc/naebServer";
import { PowerSQL, PowerSQLDefaults, PowerSQLTable, PowerSQLTableColumn, PowerSQLStatementResult } from "powersql";
import VirtualType from "genericcrud/src/virtualType";

export default NAEBServer;

export {

    respondJSON,
    respondPlain,
    respondJSX,

    HTTPFunctionHandler,
    HTTPRouteTemplate,

    /**
     * @deprecated Use HTTPFunctionHandler instead
     */
    HTTPFunctionHandler as ApiFunctionHandler,
    
    /**
     * @deprecated Use HTTPRouteTemplate instead
     */
    HTTPRouteTemplate as ApiTemplate,

    HTTPRoute,

    /**
     * @deprecated Use HTTPRoute instead
     */
    HTTPRoute as ApiRoute,

    HTTPRouteExecutor,

    /**
     * @deprecated Use HTTPRouteExecutor instead
     */
    HTTPRouteExecutor as ApiRouteExecutor,

    RouteManager,

    DbInterface,

    Crud,
    SQLCrud,
    SimpleCrud,
    ObjectModel,
    ObjectData,
    Field,
    ValuableField,
    VirtualTypes,
    VirtualType,

    PowerSQL,
    PowerSQLDefaults,
    PowerSQLTable,
    PowerSQLTableColumn,
    PowerSQLStatementResult
    
}