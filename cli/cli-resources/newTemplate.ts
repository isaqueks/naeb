import express = require('express');
import { HTTPFunctionHandler } from 'naeb';

export default async function __NAME__(
    route: HTTPFunctionHandler,
    req: express.Request,
    res: express.Response,
    next?: HTTPFunctionHandler) {
    try {
        const result = await route(req, res, next);
    }
    catch (err) {
        res.status(400).end(`Error: ${err.message}`);
    }
}