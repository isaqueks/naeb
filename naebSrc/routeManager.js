"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRouteExecutor_1 = __importDefault(require("./api/httpRouteExecutor"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * The routes manager class.
 * Used by default on `NAEBServer` to scan routes from
 * the specified directory
 */
class RouteManager {
    constructor(app, ...paths) {
        this.routes = [];
        this.workingRoutes = [];
        this.allowedExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];
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
            route.method = 'GET';
        }
        const executor = new httpRouteExecutor_1.default(route, this.app);
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
        return __awaiter(this, void 0, void 0, function* () {
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
                    const routeModule = require(abs);
                    const api = routeModule.default || routeModule;
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
        });
    }
    /**
     * Scans for routes in the specified directory
     */
    scanRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._paths || this._paths.length === 0) {
                return;
            }
            yield Promise.all(this._paths.map(path => this.scanDir(path)));
        });
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
