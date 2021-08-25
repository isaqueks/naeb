import express from "express";
import { ApiFunctionHandler } from "./apiFunctionHandler";

/**
 * The API template function.
 * It may add extra data to the response
 */
export default interface ApiTemplate {
    (
        route: ApiFunctionHandler, 
        req?: express.Request, 
        res?: express.Response, 
        next?: ApiFunctionHandler
    ): any;
}