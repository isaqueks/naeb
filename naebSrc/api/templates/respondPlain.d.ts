import express = require('express');
import { HTTPFunctionHandler } from '../httpFunctionHandler';
/**
 *
 * Will respond the request with the (`200`) returned value or (`400`) the thrown error.
 * No extra data is sent
 *
 * @param route The Api route handler
 * @param req The express Request
 * @param res The express Response
 * @param next The (optional) next
 */
export default function respondPlain(route: HTTPFunctionHandler, req: express.Request, res: express.Response, next?: HTTPFunctionHandler): Promise<void>;
