import express = require('express');

function fn(req: express.Request, res: express.Response) {

    return 'It is working (-:'

}

module.exports = {
    route: '/example',
    method: 'get',
    apiFn: fn,
} 