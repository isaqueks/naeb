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
    readonly allowedExtensions: string[];
    get path(): string;
    constructor(app: express.Application, path?: string);
    add(route: ApiRoute): ApiRoute;
    startRoute(route: ApiRoute): void;
    private sanitizePath;
    protected resolveRoutePath(dirPath: string, startDir: string, filePath: string): string;
    protected scanDir(dirPath: string, namesToIgnore?: string[], startDir?: string): void;
    /**
     * Scans for routes in the specified directory
     */
    scanRoutes(): void;
    /**
     * Starts all the found routes
     */
    startRoutes(): void;
}
