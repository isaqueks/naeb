"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const respondPlain_1 = __importDefault(require("../../ultraXSrc/api/templates/respondPlain"));
function fn(req, res) {
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
    template: respondPlain_1.default
};
