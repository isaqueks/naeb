import express = require('express');
declare type ExpressMiddleware = (req: express.Request, res: express.Response, next?: any) => any;
export default class UltraX {
    private expressApp;
    private manager;
    private port;
    get express(): express.Application;
    constructor(port: number, routesDir?: string);
    listen(callback?: (data: any) => any): UltraX;
    use(...middlewares: ExpressMiddleware[]): UltraX;
    useCors(): UltraX;
    useBodyParser(): UltraX;
    useFileUpload(): UltraX;
    get(route: string, handler: ExpressMiddleware): UltraX;
    post(route: string, handler: ExpressMiddleware): UltraX;
    all(route: string, handler: ExpressMiddleware): UltraX;
}
export {};
