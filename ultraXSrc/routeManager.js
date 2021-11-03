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
    constructor(app, ...paths) {
        this.routes = [];
        this.workingRoutes = [];
        this.allowedExtensions = ['.ts', '.js', '.jsx', '.tsx'];
        this.app = app;
        if (paths) {
            paths.forEach(path => {
                if ((!fs_1.default.existsSync(path) || !fs_1.default.statSync(path).isDirectory())) {
                    throw new Error(`"${path}" is not a valid directory`);
                }
            });
            this._paths = paths;
        }
    }
    get paths() {
        return this._paths;
    }
    add(route) {
        this.routes.push(route);
        return route;
    }
    startRoute(route) {
        if (this.workingRoutes.find(arrRoute => arrRoute.call === route)) {
            // Route already started
            return;
        }
        if (!route.method) {
            route.method = 'get';
        }
        const executor = new apiRouteExecutor_1.default(route, this.app);
        this.workingRoutes.push(executor);
        console.log(`Starting: ${route.method.toUpperCase()}\t${route.route}`);
    }
    sanitizePath(filePath, startWithSlash = true) {
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
        if (path_1.default.basename(sanitized).toLowerCase() === 'index') {
            sanitized = sanitized.substring(0, sanitized.length - 'index'.length);
        }
        return sanitized;
    }
    resolveRoutePath(dirPath, startDir, filePath) {
        const normalizedRoute = this.sanitizePath('/' +
            path_1.default.join(dirPath.replace(this.sanitizePath(path_1.default.normalize(startDir), false), ''), filePath.split('.').slice(0, -1).join('.') // Remove extension
            ));
        return normalizedRoute;
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
        if (!this._paths || this._paths.length === 0) {
            return;
        }
        this._paths.forEach(path => this.scanDir(path));
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
