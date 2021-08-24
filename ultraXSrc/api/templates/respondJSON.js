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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Will respond the request with
 * ```
 * {
 *    success: boolean,
 *    result: any,
 *    error: Error | string
 * }
 * ```
 * If no error is thrown, success is going to be `true` and result the return value.
 * Otherwise, success will be false and error the trown error
 *
 * @param route The Api route handler
 * @param req The express Request
 * @param res The express Response
 * @param next The (optional) next
 */
function respondJSON(route, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield route(req, res, next);
            res.status(200).json({
                success: true,
                result: data
            });
        }
        catch (err) {
            const safeErr = err || { stack: 'Unknown error', message: '' };
            res.status(400).json({
                success: false,
                error: (`${safeErr.message}\n${safeErr.stack}`)
            });
        }
    });
}
exports.default = respondJSON;
