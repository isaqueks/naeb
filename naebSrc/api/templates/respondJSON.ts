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
export default async function respondJSON(
    route: HTTPFunctionHandler,
    req: express.Request,
    res: express.Response,
    next?: HTTPFunctionHandler) {
    try {
        const data = await route(req, res, next);
        res.json({
            success: true,
            result: data
        });
    }
    catch (err) {
        const safeErr = (err || { stack: 'Unknown error', message: '' }) as Error;
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (process.env.NODE_ENV !== 'production') {
            return res.json({
                success: false,
                error: (`${String(safeErr.message)}\n${String(safeErr.stack)}`)
            });
        }
        res.json({
            success: false,
            error: (`${String(safeErr.message)}`)
        });
    }
}