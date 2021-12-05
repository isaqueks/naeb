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
const respondJSON_1 = __importDefault(require("./templates/respondJSON"));
class HTTPRouteExecutor {
    constructor(call, app) {
        this.call = call;
        this.app = app;
        const method = call.method.toLowerCase();
        if (!['get', 'post', 'put', 'delete', 'head', 'all'].includes(method)) {
            throw new Error(`Invalid method "${method}". (Route: ${call.route})`);
        }
        if (typeof app[method] !== 'function') {
            throw new Error(`Can't pass "${method}" route to express! (Route: ${call.route})`);
        }
        this.app[method].bind(app)(this.call.route, this.onRequest.bind(this));
    }
    onRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const handler = this.call.handler || this.call.apiFn;
            let template = this.call.template || respondJSON_1.default;
            if (!Array.isArray(template)) {
                template = [template];
            }
            const nextTemplate = (i) => __awaiter(this, void 0, void 0, function* () {
                if (!template[i]) {
                    next && (yield next());
                }
                else {
                    yield template[i](handler, req, res, () => nextTemplate(i + 1));
                }
            });
            yield nextTemplate(0);
        });
    }
}
exports.default = HTTPRouteExecutor;
