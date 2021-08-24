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
    constructor(port, routesDir) {
        this.port = port;
        this.expressApp = express();
        this.manager = new routeManager_1.default(this.expressApp, routesDir);
    }
    get express() {
        return this.expressApp;
    }
    listen(callback) {
        const result = this.expressApp.listen(this.port, () => {
            if (this.manager.path) {
                this.manager.scanRoutes();
                this.manager.startRoutes();
            }
            callback && callback(result);
        });
        return this;
    }
    use(...middlewares) {
        middlewares.forEach(middleware => this.expressApp.use(middleware));
        return this;
    }
    // Commom used stuff
    useCors() {
        this.use(cors());
        return this;
    }
    useBodyParser() {
        this.use(bodyParser());
        return this;
    }
    useFileUpload() {
        this.use(fileupload());
        return this;
    }
    // Express proxy methods
    get(route, handler) {
        this.expressApp.get(route, handler);
        return this;
    }
    post(route, handler) {
        this.expressApp.post(route, handler);
        return this;
    }
    all(route, handler) {
        this.expressApp.all(route, handler);
        return this;
    }
}
exports.default = UltraX;
