import express = require('express');
import RouteManager from './routeManager';
import asyncBodyParser from './middlewares/asyncBodyParser';

import fileupload = require('express-fileupload');

type ExpressMiddleware = (req: express.Request, res: express.Response, next?) => any;
type ListenCallback = (data: any) => any;

export default class NAEBServer {

    protected expressApp: express.Application;
    protected manager: RouteManager;
    protected port: number;

    public get routes(): RouteManager {
        return this.manager;
    }

    public get express(): express.Application {
        return this.expressApp;
    }

    constructor(port: number, routesDirs?: string | string[], expressApp?: express.Application) {
        this.port = port;
        this.expressApp = expressApp || express();
        const routes = [];
        if (routesDirs && Array.isArray(routesDirs)) {
            routesDirs.forEach(route => routes.push(route));
        }
        else if (typeof routesDirs === 'string') {
            routes.push(routesDirs);
        }
        this.manager = new RouteManager(this.expressApp, ...routes);
    }

    /**
     * Scan routes in the specified directory and start them.  
     * Already called in `listen()`
     */
    protected scanAndStartRoutes() {
        if (this.manager.paths) {
            this.manager.scanRoutes();
            this.manager.startRoutes();
        }
    }


    public listen(...args: [callback?: ListenCallback] | [hostname: string, callback?: ListenCallback]): NAEBServer {


        let callback = undefined;
        let host = undefined;

        if (args.length === 1 && typeof args[0] === 'function') {
            callback = args[0];
        }
        else {
            if (args.length === 1 && typeof args[0] === 'string') {
                callback = args[0];
            }
            else if (
                args.length === 2 && 
                typeof args[0] === 'string' && 
                typeof args[1] === 'function') 
            {
                host = args[0];
                callback = args[1];
            }
            else {
                throw new Error(`Unknown arguments! ${args}`);
            }
        }


        const realCallback = () => {
            this.scanAndStartRoutes();
            callback && callback(result);
        }

        const result = this.expressApp.listen(...[this.port, host, realCallback].filter(arg => arg !== undefined));
        return this;
    }

    /**
     * 
     * @param route The middleware scope
     * @param middleware The middleware itself
     * @returns The current NAEBServer instance
     */
    public useScoped(route: string, middleware: ExpressMiddleware): NAEBServer {
        this.expressApp.use(route, middleware);
        return this;
    }

    /**
     * Uses one or more middleware(s). For scoping, use `useScoped(route: string, middleware)`
     * @param middlewares The middleware(s) to use
     * @returns The current NAEBServer instance
     */
    public use(...middlewares: ExpressMiddleware[]): NAEBServer {
        middlewares.forEach(middleware => this.expressApp.use(middleware));
        return this;
    }


    /**
     * Will use the `cors` middleware
     * @returns The actual `NAEBServer` instance
     */
    public useCors(origin: string = '*'): NAEBServer {
        this.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', origin);
            next && next();
        });
        return this;
    }

    /**
     * Will use the `bodyParser` middleware
     * @returns The actual `NAEBServer` instance
     */
    public useBodyParser(): NAEBServer {
        this.use(express.json());
        this.use(express.urlencoded());
        return this;
    }

    /**
     * Add req.body() method to request
     * @param maxSize The maximum body size. Default is 32kb
     * @returns The actual `NAEBServer` instance
     */
    public useAsyncJsonBodyParser(maxSize: number = 32 * 1024): NAEBServer {
        this.use(asyncBodyParser(maxSize));
        return this;
    }

    /**
     * Will use the `fileupload` middleware
     * @returns The actual `NAEBServer` instance
     */
    public useFileUpload(): NAEBServer {
        this.use(fileupload());
        return this;
    }


    /**
     * Shortcut to express.static()
     * @param scope The scope path
     * @param staticDir The directory to look for the files
     * @returns The actual `NAEBServer` instance
     */
    public useStatic(scope: string = '/', staticDir: string): NAEBServer {
        this.useScoped(scope, express.static(staticDir));
        return this;
    }

    // Express proxy methods

    /**
     * The same as `express.get`
     */
    public get(route: string, handler: ExpressMiddleware): NAEBServer {
        this.expressApp.get(route, handler);
        return this;
    }

     /**
     * The same as `express.post`
     */
    public post(route: string, handler: ExpressMiddleware): NAEBServer {
        this.expressApp.post(route, handler);
        return this;
    }

     /**
     * The same as `express.all`
     */
    public all(route: string, handler: ExpressMiddleware): NAEBServer {
        this.expressApp.all(route, handler);
        return this;
    }

}