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
export default async function respondJSX(
    route: ApiFunctionHandler,
    req: express.Request,
    res: express.Response,
    next?: ApiFunctionHandler) {
    try {
        const jsx = await route(req, res, next);
        const rendered = ReactDOMServer.renderToNodeStream(jsx);
        res.status(200).type('html');
        rendered.pipe(res)
    }
    catch (err) {
        const safeErr = (err || { stack: 'Unknown error', message: '' }) as Error;
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.json({
            success: false,
            error: (`${String(safeErr.message)}\n${String(safeErr.stack)}`)
        });
    }
}