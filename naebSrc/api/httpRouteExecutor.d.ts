import HTTPRoute from "./httpRoute";
declare class HTTPRouteExecutor {
    call: HTTPRoute;
    app: any;
    constructor(call: HTTPRoute, app: any);
    private onRequest;
}
export default HTTPRouteExecutor;
