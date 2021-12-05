import express = require('express');
import HTTPRoute from "./api/httpRoute";
/**
 * The routes manager class.
 * Used by default on `NAEBServer` to scan routes from
 * the specified directory
 */
export default class RouteManager {
    private app;
    private routes;
    private workingRoutes;
    private _paths;
    readonly allowedExtensions: string[];
    get paths(): string[];
    constructor(app: express.Application, ...paths: string[]);
    add(route: HTTPRoute): HTTPRoute;
    startRoute(route: HTTPRoute): void;
    private sanitizePath;
    protected resolveRoutePath(dirPath: string, startDir: string, filePath: string): string;
    protected scanDir(dirPath: string, namesToIgnore?: string[], startDir?: string): Promise<void>;
    /**
     * Scans for routes in the specified directory
     */
    scanRoutes(): Promise<void>;
    /**
     * Starts all the found routes
     */
    startRoutes(): void;
}
