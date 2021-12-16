import express = require('express');
import { HTTPFunctionHandler } from '../httpFunctionHandler';
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
export default function respondJSX(route: HTTPFunctionHandler, req: express.Request, res: express.Response, next?: HTTPFunctionHandler): Promise<express.Response<any, Record<string, any>>>;
