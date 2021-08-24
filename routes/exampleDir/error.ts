import express = require('express');
import respondPlain from '../../ultraXSrc/api/templates/respondPlain';


function fn(req: express.Request, res: express.Response) {
    
    throw new Error('We got an error!');
    
}

/* 
    As no "route" is provided, 
    the path will be used. (/exampleDir/error)
*/
module.exports = {
    method: 'get',
    apiFn: fn,
    // respondPlain will respond the request with the returned content or error,
    // without any processing!
    template: respondPlain
}