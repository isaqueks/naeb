"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiRouteExecutor_1 = __importDefault(require("./api/apiRouteExecutor"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
                    const fileSplitted = file.split('.');
                    fileSplitted.pop();
                    api.route = '/' + `${dirPath.replace(startDir, '').substring(1)}/${fileSplitted.join('.')}`
                        .split('/')
                        .filter(part => part && part.length > 0)
                        .join('/');
                }
                if (!api) {
                    console.log(`ERR: "${abs}" is not an ApiCall!`);
                }
                else {
                    this.routes.push(api);
                }
            }
        }
    }
    scanRoutes() {
        if (!this._path) {
            return;
        }
        this.scanDir(this._path);
    }
    startRoutes() {
        for (let route of this.routes) {
            console.log(`Starting: ${route.method.toUpperCase()}\t${route.route}`);
            this.workingRoutes.push(new apiRouteExecutor_1.default(route, this.app));
        }
    }
}
exports.default = RouteManager;
