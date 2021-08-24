"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fn(req, res) {
    return 'It is working (-:';
}
module.exports = {
    route: '/example',
    method: 'get',
    apiFn: fn,
};
