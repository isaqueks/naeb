import express = require('express');
import RouteManager from './routeManager';
import './extensions/request';
declare type ExpressMiddleware = (req: express.Request, res: express.Response, next?: any) => any;
declare type ListenCallback = (data: any) => any;
export default class UltraX {
    protected expressApp: express.Application;
    protected manager: RouteManager;
    protected port: number;
    get routes(): RouteManager;
    get express(): express.Application;
    constructor(port: number, routesDir?: string, expressApp?: express.Application);
    /**
     * Scan routes in the specified directory and start them.
     * Already called in `listen()`
     */
    protected scanAndStartRoutes(): void;
    listen(...args: [callback?: ListenCallback] | [hostname: string, callback?: ListenCallback]): UltraX;
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
    useCors(origin?: string): UltraX;
    /**
     * Will use the `bodyParser` middleware
     * @returns The actual `UltraX` instance
     */
    useBodyParser(): UltraX;
    /**
     * Add req.body() method to request
     * @param maxSize The maximum body size. Default is 32kb
     * @returns The actual `UltraX` instance
     */
    useAsyncJsonBodyParser(maxSize?: number): UltraX;
    /**
     * Will use the `fileupload` middleware
     * @returns The actual `UltraX` instance
     */
    useFileUpload(): UltraX;
    /**
     * Shortcut to express.static()
     * @param scope The scope path
     * @param staticDir The directory to look for the files
     * @returns The actual `UltraX` instance
     */
    useStatic(scope: string, staticDir: string): UltraX;
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
