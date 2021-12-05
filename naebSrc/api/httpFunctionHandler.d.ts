import express = require('express');
export interface HTTPFunctionHandler {
    (req?: express.Request, res?: express.Response, next?: Function): any;
}
