import ApiCall from "../ultraXSrc/api/apiCall";
import express = require('express');

function fn(req: express.Request, res: express.Response) {

    res.end('Hello World!');

}

module.exports = new ApiCall('/test', 'get', fn);