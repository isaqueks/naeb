import ApiRoute, { createRoute } from "../ultraXSrc/api/apiRoute";
import express = require('express');

function fn(req: express.Request, res: express.Response) {

    return 'It is working (-:'

}

module.exports = createRoute('/example', 'get', fn);