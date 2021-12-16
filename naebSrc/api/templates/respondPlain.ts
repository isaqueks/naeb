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
export default async function respondPlain(
    route: HTTPFunctionHandler,
    req: express.Request,
    res: express.Response,
    next?: HTTPFunctionHandler) {
    try {
        const data = await route(req, res, next);
        res.end(data);
    }
    catch (err) {
        const safeErr = err || { stack: 'Unknown error', message: '' };
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (process.env.NODE_ENV !== 'production') {
            return res.end(`${String(safeErr.message)}\n${String(safeErr.stack)}`);
        }
        res.end(`${String(safeErr.message)}`);
    }
}