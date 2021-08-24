import { ApiFunctionHandler } from "./ultraXSrc/api/apiFunctionHandler";
import ApiRoute from "./ultraXSrc/api/apiRoute";
import ApiRouteExecutor from "./ultraXSrc/api/apiRouteExecutor";
import ApiTemplate from "./ultraXSrc/api/apiTemplate";
import respondJSON from "./ultraXSrc/api/templates/respondJSON";
import respondPlain from "./ultraXSrc/api/templates/respondPlain";
import RouteManager from "./ultraXSrc/routeManager";
import UltraX from "./ultraXSrc/ultrax";

export default UltraX;

export {

    respondJSON,
    respondPlain,

    ApiFunctionHandler,
    ApiTemplate,
    ApiRoute,

    ApiRouteExecutor,

    RouteManager,
    
}