import express = require('express');

export interface ApiFunction {
    (req?: express.Request, res?: express.Response, next?: Function): any;
}

export default interface ApiRoute {
    apiFn: ApiFunction;
    route?: string;
    method?: string;
}

export function createRoute(route: string, method: string, apiFn: ApiFunction): ApiRoute {

    return {
        apiFn: apiFn,
        route: route,
        method: method
    }

}