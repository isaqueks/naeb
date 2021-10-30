import express = require('express');
import { ApiFunctionHandler } from '../apiFunctionHandler';
import ReactDOMServer from 'react-dom/server';

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
export default async function respondJSON(
    route: ApiFunctionHandler,
    req: express.Request,
    res: express.Response,
    next?: ApiFunctionHandler) {
    try {
        const jsx = await route(req, res, next);
        const rendered = ReactDOMServer.renderToNodeStream(jsx);
        res.status(200).type('html').end(rendered);
    }
    catch (err) {
        const safeErr = err || { stack: 'Unknown error', message: '' };
        res.status(400).json({
            success: false,
            error: (`${safeErr.message}\n${safeErr.stack}`)
        });
    }
}