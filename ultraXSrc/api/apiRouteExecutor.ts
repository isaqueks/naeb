import ApiRoute from "./apiRoute";

class ApiRouteExecutor {

    call: ApiRoute;
    app: any;

    constructor(call: ApiRoute, app: any) {
        this.call = call;
        this.app = app;

        const method = call.method || 'get';

        if (!this.app[method]) {
            throw new Error(`Invalid method "${method}". (Route: ${call.route})`);
        }
        this.app[method].bind(app)(this.call.route, this.onRequest.bind(this));
    }

    private async onRequest(req, res) {
        try {
            const resultJson = await this.call.apiFn(req, res);
            return res.status(200).json({
                success: true,
                result: resultJson
            })
        }
        catch (err) {
            const safeErr = err || { stack: 'Unknown error', message: '' };
            return res.status(400).json({
                success: false,
                error: (`${safeErr.message}\n${safeErr.stack}`)
            })
        }
    }

}

export default ApiRouteExecutor;