import ApiCall from "./apiCall";

class ApiRoute {

    call: ApiCall;
    app: any;

    constructor(call: ApiCall, app: any) {
        this.call = call;
        this.app = app;
        this.app[this.call.method].bind(app)(this.call.route, this.onRequest.bind(this));
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

export default ApiRoute;