"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routeManager_1 = __importDefault(require("./routeManager"));
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
class UltraX {
    constructor(port, routesDir, expressApp) {
        this.port = port;
        this.expressApp = expressApp || express();
        this.manager = new routeManager_1.default(this.expressApp, routesDir);
    }
    get routes() {
        return this.manager;
    }
    get express() {
        return this.expressApp;
    }
    /**
     * Scan routes in the specified directory and start them.
     * Already called in `listen()`
     */
    scanAndStartRoutes() {
        if (this.manager.path) {
            this.manager.scanRoutes();
            this.manager.startRoutes();
        }
    }
    listen(...args) {
        let callback = undefined;
        let host = undefined;
        if (args.length === 1 && typeof args[0] === 'function') {
            callback = args[0];
        }
        else {
            if (args.length === 1 && typeof args[0] === 'string') {
                callback = args[0];
            }
            else if (args.length === 2 &&
                typeof args[0] === 'string' &&
                typeof args[1] === 'function') {
                host = args[0];
                callback = args[1];
            }
            else {
                throw new Error(`Unknown arguments! ${args}`);
            }
        }
        const realCallback = () => {
            this.scanAndStartRoutes();
            callback && callback(result);
        };
        const result = this.expressApp.listen(...[this.port, host, realCallback].filter(arg => arg !== undefined));
        return this;
    }
    /**
     *
     * @param route The middleware scope
     * @param middleware The middleware itself
     * @returns The current UltraX instance
     */
    useScoped(route, middleware) {
        this.expressApp.use(route, middleware);
        return this;
    }
    /**
     * Uses one or more middleware(s). For scoping, use `useScoped(route: string, middleware)`
     * @param middlewares The middleware(s) to use
     * @returns The current UltraX instance
     */
    use(...middlewares) {
        middlewares.forEach(middleware => this.expressApp.use(middleware));
        return this;
    }
    /**
     * Will use the `cors` middleware
     * @returns The actual `UltraX` instance
     */
    useCors() {
        this.use(cors());
        return this;
    }
    /**
     * Will use the `bodyParser` middleware
     * @returns The actual `UltraX` instance
     */
    useBodyParser() {
        this.use(bodyParser());
        return this;
    }
    /**
     * Will use the `fileupload` middleware
     * @returns The actual `UltraX` instance
     */
    useFileUpload() {
        this.use(fileupload());
        return this;
    }
    // Express proxy methods
    /**
     * The same as `express.get`
     */
    get(route, handler) {
        this.expressApp.get(route, handler);
        return this;
    }
    /**
    * The same as `express.post`
    */
    post(route, handler) {
        this.expressApp.post(route, handler);
        return this;
    }
    /**
    * The same as `express.all`
    */
    all(route, handler) {
        this.expressApp.all(route, handler);
        return this;
    }
}
exports.default = UltraX;
