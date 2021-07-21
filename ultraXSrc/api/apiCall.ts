class ApiCall {
    apiFn: Function;
    route: string;
    method: string;

    constructor(route: string, method: string, apiFn: Function) {
        this.apiFn = apiFn;
        this.route = route;
        this.method = method;
    }

}

export default ApiCall;