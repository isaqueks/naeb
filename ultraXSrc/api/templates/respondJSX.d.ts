import express = require('express');
import { ApiFunctionHandler } from '../apiFunctionHandler';
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
export default function respondJSX(route: ApiFunctionHandler, req: express.Request, res: express.Response, next?: ApiFunctionHandler): Promise<void>;
