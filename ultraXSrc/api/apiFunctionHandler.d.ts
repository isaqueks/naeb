import express = require('express');
export interface ApiFunctionHandler {
    (req?: express.Request, res?: express.Response, next?: Function): any;
}
