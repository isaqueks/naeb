import express = require('express');
import { HTTPFunctionHandler } from '../httpFunctionHandler';
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
export default function respondJSON(route: HTTPFunctionHandler, req: express.Request, res: express.Response, next?: HTTPFunctionHandler): Promise<void>;
