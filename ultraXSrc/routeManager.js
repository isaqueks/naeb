"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiRouteExecutor_1 = __importDefault(require("./api/apiRouteExecutor"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * The routes manager class.
 * Used by default on `UltraX` to scan routes from
 * the specified directory
 */
class RouteManager {
    constructor(app, path) {
        this.routes = [];
        this.workingRoutes = [];
        this.app = app;
        this._path = path;
        if (path && !fs_1.default.existsSync(path)) {
            throw new Error(`"${path}" is not a valid directory`);
        }
    }
    get path() {
        return this._path;
    }
    add(route) {
        this.routes.push(route);
        return route;
    }
    startRoute(route) {
        if (this.workingRoutes.find(arrRoute => arrRoute.call === route)) {
            return;
        }
        if (!route.method) {
            route.method = 'get';
        }
        const executor = new apiRouteExecutor_1.default(route, this.app);
        this.workingRoutes.push(executor);
        console.log(`Starting: ${route.method.toUpperCase()}\t${route.route}`);
    }
    resolveRoutePath(dirPath, startDir, filePath) {
        const fileSplitted = filePath.split('.');
        fileSplitted.pop();
        const route = '/' + `${dirPath.replace(startDir, '').substring(1)}/${fileSplitted.join('.')}`
            .replace(/\\/, '/')
            .split('/')
            .filter(part => part && part.length > 0)
            .join('/');
        return route;
    }
    scanDir(dirPath, namesToIgnore = ['tmp'], startDir = '') {
        if (!startDir) {
            startDir = dirPath;
        }
        const files = fs_1.default.readdirSync(dirPath);
        for (let file of files) {
            if (namesToIgnore.includes(file)) {
                continue;
            }
            const abs = path_1.default.join(dirPath, file);
            if (fs_1.default.lstatSync(abs).isDirectory()) {
                this.scanDir(abs, namesToIgnore, startDir);
            }
            else if (file.endsWith('.ts') || file.endsWith('.js')) {
                const api = require(abs);
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
    scanRoutes() {
        if (!this._path) {
            return;
        }
        this.scanDir(this._path);
    }
    /**
     * Starts all the found routes
     */
    startRoutes() {
        for (let route of this.routes) {
            this.startRoute(route);
        }
    }
}
exports.default = RouteManager;
