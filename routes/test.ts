import ApiCall from "../ultraXSrc/api/apiCall";
import express = require('express');

function fn(req: express.Request, res: express.Response) {

    return 'It is working (-:'

}

module.exports = new ApiCall('/test', 'get', fn);