import express = require('express');
import ApiRoute from "./api/apiRoute";
import ApiRouteExecutor from "./api/apiRouteExecutor";
import fs from 'fs';
import path from 'path';

/**
 * The routes manager class. 
 * Used by default on `UltraX` to scan routes from 
 * the specified directory
 */
export default class RouteManager {

    private app: express.Application;
    private routes: ApiRoute[] = [];
    private workingRoutes: ApiRouteExecutor[] = []; 

    private _path: string;

    public get path(): string {
        return this._path;
    }

    constructor(app: express.Application, path?: string) {
        this.app = app;
        this._path = path;
        if (path && (!fs.existsSync(path) || !fs.statSync(path).isDirectory())) {
            throw new Error(`"${path}" is not a valid directory`);
        }
    }

    public add(route: ApiRoute): ApiRoute {
        this.routes.push(route);
        return route;
    }

    public startRoute(route: ApiRoute) {
        if (this.workingRoutes.find(arrRoute => arrRoute.call === route)) {
            // Route already started
            return;
        }
        if (!route.method) {
            route.method = 'get';
        }
        const executor = new ApiRouteExecutor(route, this.app);
        this.workingRoutes.push(executor);
        console.log(`Starting: ${route.method.toUpperCase()}\t${route.route}`);
    }

    private sanitizePath(filePath: string, startWithSlash: boolean = true): string {
        let sanitized = filePath
            .split('\\')
            .join('/')
            .split('/')
            .filter(item => item && item.length > 0)
            .join('/');
        if (sanitized.startsWith('/') && !startWithSlash) {
            sanitized = sanitized.substring(1);
        }
        else if (startWithSlash) {
            sanitized = '/' + sanitized;
        }
        if (path.basename(sanitized).toLowerCase() === 'index') {
            sanitized = sanitized.substring(0, sanitized.length - 'index'.length);
        }
        return sanitized;
    }

    protected resolveRoutePath(dirPath: string, startDir: string, filePath: string): string {
        const normalizedRoute = this.sanitizePath('/'+
            path.join(
                dirPath.replace(this.sanitizePath(path.normalize(startDir), false), ''),
                filePath.split('.').slice(0, -1).join('.') // Remove extension
            )
        );
        return normalizedRoute;
    }

    protected scanDir(dirPath: string, namesToIgnore = ['tmp'], startDir = '') {
        if (!startDir) {
            startDir = dirPath;
        }
        const files: string[] = fs.readdirSync(dirPath);
    
        for (let file of files) {
            if (namesToIgnore.includes(file)) {
                continue;
            }
    
            const abs = path.join(dirPath, file);
    
            if (fs.lstatSync(abs).isDirectory()) {
                this.scanDir(abs, namesToIgnore, startDir);
            }
            else if (file.endsWith('.ts') || file.endsWith('.js')) {
                const api: ApiRoute = require(abs);
                if (!api.route) {
                    api.route = this.resolveRoutePath(dirPath, startDir, file);
                }
                if (!api) {
                    console.log(`ERR: "${abs}" is not an ApiCall!`);
                }
                else {
                    this.add(api);
                }
            }
        }
    }

    /**
     * Scans for routes in the specified directory
     */
    public scanRoutes() {
        if (!this._path) {
            return;
        }

        this.scanDir(this._path);
    }

    /**
     * Starts all the found routes
     */
    public startRoutes() {
        for (let route of this.routes) {
            this.startRoute(route);
        }
    }

}