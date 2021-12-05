import { Crud, DbInterface, Field, ObjectData, ObjectModel, SimpleCrud, SQLCrud, ValuableField, VirtualTypes } from "genericcrud";
import { HTTPFunctionHandler } from "./ultraXSrc/api/httpFunctionHandler";
import HTTPRoute from "./ultraXSrc/api/httpRoute";
import HTTPRouteExecutor from "./ultraXSrc/api/httpRouteExecutor";
import HTTPRouteTemplate from "./ultraXSrc/api/httpTemplate";
import respondJSON from "./ultraXSrc/api/templates/respondJSON";
import respondPlain from "./ultraXSrc/api/templates/respondPlain";
import respondJSX from "./ultraXSrc/api/templates/respondJSX";
import RouteManager from "./ultraXSrc/routeManager";
import UltraX from "./ultraXSrc/ultrax";
import { PowerSQL, PowerSQLDefaults, PowerSQLTable, PowerSQLTableColumn, PowerSQLStatementResult } from "powersql";
import VirtualType from "genericcrud/src/virtualType";

export default UltraX;

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