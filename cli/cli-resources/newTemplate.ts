import express = require('express');
import { ApiFunctionHandler } from 'ultrax';

export default async function __NAME__(
    route: ApiFunctionHandler,
    req: express.Request,
    res: express.Response,
    next?: ApiFunctionHandler) {
    try {
        const result = await route(req, res, next);
    }
    catch (err) {
        res.status(400).end(`Error: ${err.message}`);
    }
}