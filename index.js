"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteManager = exports.ApiRouteExecutor = exports.respondPlain = exports.respondJSON = void 0;
const apiRouteExecutor_1 = __importDefault(require("./ultraXSrc/api/apiRouteExecutor"));
exports.ApiRouteExecutor = apiRouteExecutor_1.default;
const respondJSON_1 = __importDefault(require("./ultraXSrc/api/templates/respondJSON"));
exports.respondJSON = respondJSON_1.default;
const respondPlain_1 = __importDefault(require("./ultraXSrc/api/templates/respondPlain"));
exports.respondPlain = respondPlain_1.default;
const routeManager_1 = __importDefault(require("./ultraXSrc/routeManager"));
exports.RouteManager = routeManager_1.default;
const ultrax_1 = __importDefault(require("./ultraXSrc/ultrax"));
exports.default = ultrax_1.default;
