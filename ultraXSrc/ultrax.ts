import express = require('express');
import RouteManager from './routeManager';

import fileupload = require('express-fileupload');

type ExpressMiddleware = (req: express.Request, res: express.Response, next?) => any;
type ListenCallback = (data: any) => any;

export default class UltraX {

    protected expressApp: express.Application;
    protected manager: RouteManager;
    protected port: number;

    public get routes(): RouteManager {
        return this.manager;
    }

    public get express(): express.Application {
        return this.expressApp;
    }

    constructor(port: number, routesDir?: string, expressApp?: express.Application) {
        this.port = port;
        this.expressApp = expressApp || express();
        this.manager = new RouteManager(this.expressApp, routesDir);
    }

    /**
     * Scan routes in the specified directory and start them.  
     * Already called in `listen()`
     */
    protected scanAndStartRoutes() {
        if (this.manager.path) {
            this.manager.scanRoutes();
            this.manager.startRoutes();
        }
    }


    public listen(...args: [callback?: ListenCallback] | [hostname: string, callback?: ListenCallback]): UltraX {


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
     * @returns The current UltraX instance
     */
    public useScoped(route: string, middleware: ExpressMiddleware): UltraX {
        this.expressApp.use(route, middleware);
        return this;
    }

    /**
     * Uses one or more middleware(s). For scoping, use `useScoped(route: string, middleware)`
     * @param middlewares The middleware(s) to use
     * @returns The current UltraX instance
     */
    public use(...middlewares: ExpressMiddleware[]): UltraX {
        middlewares.forEach(middleware => this.expressApp.use(middleware));
        return this;
    }


    /**
     * Will use the `cors` middleware
     * @returns The actual `UltraX` instance
     */
    public useCors(origin: string = '*'): UltraX {
        this.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', origin);
            next && next();
        });
        return this;
    }

    /**
     * Will use the `bodyParser` middleware
     * @returns The actual `UltraX` instance
     */
    public useBodyParser(): UltraX {
        this.use(express.json());
        this.use(express.urlencoded());
        return this;
    }

    /**
     * Will use the `fileupload` middleware
     * @returns The actual `UltraX` instance
     */
    public useFileUpload(): UltraX {
        this.use(fileupload());
        return this;
    }


    /**
     * Shortcut to express.static()
     * @param scope The scope path
     * @param staticDir The directory to look for the files
     * @returns The actual `UltraX` instance
     */
    public useStatic(scope: string = '/', staticDir: string): UltraX {
        this.useScoped(scope, express.static(staticDir));
        return this;
    }

    // Express proxy methods

    /**
     * The same as `express.get`
     */
    public get(route: string, handler: ExpressMiddleware): UltraX {
        this.expressApp.get(route, handler);
        return this;
    }

     /**
     * The same as `express.post`
     */
    public post(route: string, handler: ExpressMiddleware): UltraX {
        this.expressApp.post(route, handler);
        return this;
    }

     /**
     * The same as `express.all`
     */
    public all(route: string, handler: ExpressMiddleware): UltraX {
        this.expressApp.all(route, handler);
        return this;
    }

}