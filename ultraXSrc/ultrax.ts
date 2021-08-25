import express = require('express');
import RouteManager from './routeManager';

import fileupload = require('express-fileupload');
import bodyParser = require('body-parser');
import cors = require('cors');

type ExpressMiddleware = (req: express.Request, res: express.Response, next?) => any;

export default class UltraX {

    private expressApp: express.Application;
    private manager: RouteManager;
    private port: number;

    public get express(): express.Application {
        return this.expressApp;
    }

    constructor(port: number, routesDir?: string) {
        this.port = port;
        this.expressApp = express();
        this.manager = new RouteManager(this.expressApp, routesDir);
    }

    public listen(callback?: (data: any) => any): UltraX {
        const result = this.expressApp.listen(this.port, () => {
            if (this.manager.path) {
                this.manager.scanRoutes();
                this.manager.startRoutes();
            }
            callback && callback(result);
        });
        return this;
    }

    public use(...middlewares: ExpressMiddleware[]): UltraX {
        middlewares.forEach(middleware => this.expressApp.use(middleware));
        return this;
    }


    /**
     * Will use the `cors` middleware
     * @returns The actual `UltraX` instance
     */
    public useCors(): UltraX {
        this.use(cors());
        return this;
    }

    /**
     * Will use the `bodyParser` middleware
     * @returns The actual `UltraX` instance
     */
    public useBodyParser(): UltraX {
        this.use(bodyParser());
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