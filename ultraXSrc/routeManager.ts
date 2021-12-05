import express = require('express');
import HTTPRoute from "./api/httpRoute";
import HTTPRouteExecutor from "./api/httpRouteExecutor";
import fs from 'fs';
import path from 'path';

/**
 * The routes manager class. 
 * Used by default on `UltraX` to scan routes from 
 * the specified directory
 */
export default class RouteManager {

    private app: express.Application;
    private routes: HTTPRoute[] = [];
    private workingRoutes: HTTPRouteExecutor[] = []; 

    private _paths: string[];

    public readonly allowedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];

    public get paths(): string[] {
        return this._paths;
    }

    constructor(app: express.Application, ...paths: string[]) {
        this.app = app;
        if (paths) {
            paths.forEach(path => {
                if ((!fs.existsSync(path) || !fs.statSync(path).isDirectory())) {
                    throw new Error(`"${path}" is not a valid directory`);
                }
            });
            this._paths = paths;
        }
    }

    public add(route: HTTPRoute): HTTPRoute {
        this.routes.push(route);
        return route;
    }

    public startRoute(route: HTTPRoute) {
        if (this.workingRoutes.find(arrRoute => arrRoute.call === route)) {
            // Route already started
            return;
        }
        if (!route.method) {
            route.method = 'GET';
        }
        const executor = new HTTPRouteExecutor(route, this.app);
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

    protected async scanDir(dirPath: string, namesToIgnore = ['tmp'], startDir = '') {
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
            else {
                let extensionAllowed = false;
                for (const ext of this.allowedExtensions) {
                    if (file.toLowerCase().endsWith(ext)) {
                        extensionAllowed = true;
                        break;
                    }
                }
                if (!extensionAllowed) {
                    return;
                }
                
                const routeModule = require(abs);
                const api: HTTPRoute = routeModule.default || routeModule;
                
                
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
    public async scanRoutes() {
        if (!this._paths || this._paths.length === 0) {
            return;
        }

        await Promise.all(this._paths.map(path => this.scanDir(path)));
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