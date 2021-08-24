import express from "express";
import { ApiFunctionHandler } from "./apiFunctionHandler";

export default interface ApiTemplate {
    (
        route: ApiFunctionHandler, 
        req?: express.Request, 
        res?: express.Response, 
        next?: ApiFunctionHandler
    ): any;
}