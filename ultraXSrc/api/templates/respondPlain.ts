import express = require('express');
import { ApiFunctionHandler } from '../apiFunctionHandler';

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
    route: ApiFunctionHandler,
    req: express.Request,
    res: express.Response,
    next?: ApiFunctionHandler) {
    try {
        const data = await route(req, res, next);
        res.status(200).end(data);
    }
    catch (err) {
        const safeErr = err || { stack: 'Unknown error', message: '' };
        res.status(400).end(`${safeErr.message}\n${safeErr.stack}`);
    }
}