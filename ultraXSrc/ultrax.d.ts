import express = require('express');
declare type ExpressMiddleware = (req: express.Request, res: express.Response, next?: any) => any;
export default class UltraX {
    private expressApp;
    private manager;
    private port;
    get express(): express.Application;
    constructor(port: number, routesDir?: string);
    listen(callback?: (data: any) => any): UltraX;
    /**
     *
     * @param route The middleware scope
     * @param middleware The middleware itself
     * @returns The current UltraX instance
     */
    useScoped(route: string, middleware: ExpressMiddleware): UltraX;
    /**
     * Uses one or more middleware(s). For scoping, use `useScoped(route: string, middleware)`
     * @param middlewares The middleware(s) to use
     * @returns The current UltraX instance
     */
    use(...middlewares: ExpressMiddleware[]): UltraX;
    /**
     * Will use the `cors` middleware
     * @returns The actual `UltraX` instance
     */
    useCors(): UltraX;
    /**
     * Will use the `bodyParser` middleware
     * @returns The actual `UltraX` instance
     */
    useBodyParser(): UltraX;
    /**
     * Will use the `fileupload` middleware
     * @returns The actual `UltraX` instance
     */
    useFileUpload(): UltraX;
    /**
     * The same as `express.get`
     */
    get(route: string, handler: ExpressMiddleware): UltraX;
    /**
    * The same as `express.post`
    */
    post(route: string, handler: ExpressMiddleware): UltraX;
    /**
    * The same as `express.all`
    */
    all(route: string, handler: ExpressMiddleware): UltraX;
}
export {};
