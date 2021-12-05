import express = require('express');
import HTTPRouteTemplate from './httpTemplate';

export interface HTTPFunctionHandler {
    (req?: express.Request, res?: express.Response, next?: Function): any;
}