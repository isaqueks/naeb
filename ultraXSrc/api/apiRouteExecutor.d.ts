import ApiRoute from "./apiRoute";
declare class ApiRouteExecutor {
    call: ApiRoute;
    app: any;
    constructor(call: ApiRoute, app: any);
    private onRequest;
}
export default ApiRouteExecutor;
