import express from "express";
import { HTTPFunctionHandler } from "./httpFunctionHandler";

/**
 * The API template function.
 * It may add extra data to the response
 */
export default interface HTTPRouteTemplate {
    (
        route: HTTPFunctionHandler, 
        req?: express.Request, 
        res?: express.Response, 
        next?: HTTPFunctionHandler
    ): any;
}