import express = require('express');
import ApiRoute from "./api/apiRoute";
/**
 * The routes manager class.
 * Used by default on `UltraX` to scan routes from
 * the specified directory
 */
export default class RouteManager {
    private app;
    private routes;
    private workingRoutes;
    private _path;
    get path(): string;
    constructor(app: express.Application, path?: string);
    add(route: ApiRoute): void;
    private scanDir;
    /**
     * Scans for routes in the specified directory
     */
    scanRoutes(): void;
    /**
     * Starts all the found routes
     */
    startRoutes(): void;
}
