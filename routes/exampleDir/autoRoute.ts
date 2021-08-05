import express = require('express');


function fn(req: express.Request, res: express.Response) {
    
    return 'autoRoute is working (-:'
    
}

/* 
    As no "route" is provided, 
    the path will be used. (/exampleDir/autoRoute)
*/
module.exports = {
    method: 'get',
    apiFn: fn
}