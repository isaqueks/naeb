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
const server_1 = __importDefault(require("react-dom/server"));
/**
 * Will respond the request with
 * ```
 * rendered JSX to HTML.
 * ```
 *
 * @param route The Api route handler
 * @param req The express Request
 * @param res The express Response
 * @param next The (optional) next
 */
function respondJSX(route, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jsx = yield route(req, res, next);
            const rendered = server_1.default.renderToNodeStream(jsx);
            res.status(200).type('html').end(rendered);
        }
        catch (err) {
            const safeErr = (err || { stack: 'Unknown error', message: '' });
            res.status(400).json({
                success: false,
                error: (`${safeErr.message}\n${safeErr.stack}`)
            });
        }
    });
}
exports.default = respondJSX;
