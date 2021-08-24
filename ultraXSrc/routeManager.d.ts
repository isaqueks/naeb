import express = require('express');
export default class RouteManager {
    private app;
    private routes;
    private workingRoutes;
    private _path;
    get path(): string;
    constructor(app: express.Application, path?: string);
    private scanDir;
    scanRoutes(): void;
    startRoutes(): void;
}
