import express = require('express');
import RouteManager from './routeManager';
declare type ExpressMiddleware = (req: express.Request, res: express.Response, next?: any) => any;
declare type ListenCallback = (data: any) => any;
export default class NAEBServer {
    protected expressApp: express.Application;
    protected manager: RouteManager;
    protected port: number;
    get routes(): RouteManager;
    get express(): express.Application;
    constructor(port: number, routesDirs?: string | string[], expressApp?: express.Application);
    /**
     * Scan routes in the specified directory and start them.
     * Already called in `listen()`
     */
    protected scanAndStartRoutes(): void;
    listen(...args: [callback?: ListenCallback] | [hostname: string, callback?: ListenCallback]): NAEBServer;
    /**
     *
     * @param route The middleware scope
     * @param middleware The middleware itself
     * @returns The current NAEBServer instance
     */
    useScoped(route: string, middleware: ExpressMiddleware): NAEBServer;
    /**
     * Uses one or more middleware(s). For scoping, use `useScoped(route: string, middleware)`
     * @param middlewares The middleware(s) to use
     * @returns The current NAEBServer instance
     */
    use(...middlewares: ExpressMiddleware[]): NAEBServer;
    /**
     * Will use the `cors` middleware
     * @returns The actual `NAEBServer` instance
     */
    useCors(origin?: string): NAEBServer;
    /**
     * Will use the `bodyParser` middleware
     * @returns The actual `NAEBServer` instance
     */
    useBodyParser(): NAEBServer;
    /**
     * Add req.body() method to request
     * @param maxSize The maximum body size. Default is 32kb
     * @returns The actual `NAEBServer` instance
     */
    useAsyncJsonBodyParser(maxSize?: number): NAEBServer;
    /**
     * Will use the `fileupload` middleware
     * @returns The actual `NAEBServer` instance
     */
    useFileUpload(): NAEBServer;
    /**
     * Shortcut to express.static()
     * @param scope The scope path
     * @param staticDir The directory to look for the files
     * @returns The actual `NAEBServer` instance
     */
    useStatic(scope: string, staticDir: string): NAEBServer;
    /**
     * The same as `express.get`
     */
    get(route: string, handler: ExpressMiddleware): NAEBServer;
    /**
    * The same as `express.post`
    */
    post(route: string, handler: ExpressMiddleware): NAEBServer;
    /**
    * The same as `express.all`
    */
    all(route: string, handler: ExpressMiddleware): NAEBServer;
}
export {};
