import express = require('express');
import ApiTemplate from './apiTemplate';

export interface ApiFunctionHandler {
    (req?: express.Request, res?: express.Response, next?: Function): any;
}