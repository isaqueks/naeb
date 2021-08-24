"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fn(req, res) {
    return 'autoRoute is working (-:';
}
/*
    As no "route" is provided,
    the path will be used. (/exampleDir/autoRoute)
*/
module.exports = {
    method: 'get',
    apiFn: fn
};
