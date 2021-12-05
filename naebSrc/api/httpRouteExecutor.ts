import HTTPRoute from "./httpRoute";
import respondJSON from "./templates/respondJSON";

class HTTPRouteExecutor {

    call: HTTPRoute;
    app: any;

    constructor(call: HTTPRoute, app: any) {
        this.call = call;
        this.app = app;

        const method = call.method.toLowerCase()

        if (!['get', 'post', 'put', 'delete', 'head', 'all'].includes(method)) {
            throw new Error(`Invalid method "${method}". (Route: ${call.route})`);
        }
        if (typeof app[method] !== 'function') {
            throw new Error(`Can't pass "${method}" route to express! (Route: ${call.route})`);
        }
        this.app[method].bind(app)(this.call.route, this.onRequest.bind(this));
    }

    private async onRequest(req, res, next) {
        
        const handler = this.call.handler || this.call.apiFn;
        let template = this.call.template || respondJSON;
        if (!Array.isArray(template)) {
            template = [template];
        }

        const nextTemplate = async (i: number) => {
            if (!template[i]) {
                next && await next();
            }
            else {
                await template[i](handler, req, res, () => nextTemplate(i+1));
            }
        }

        await nextTemplate(0);
    }

}

export default HTTPRouteExecutor;