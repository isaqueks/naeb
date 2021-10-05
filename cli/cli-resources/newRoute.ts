import express = require('express');

function fn(req: express.Request, res: express.Response) {

    return 'Hello World!'

}

module.exports = {
    route: '/',
    method: 'get',
    apiFn: fn,
} 