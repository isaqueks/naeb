import express = require('express');
import RouteManager from './routeManager';

import fileupload = require('express-fileupload');
import bodyParser = require('body-parser');
import cors = require('cors');

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

    public use(...middlewares: Array<(req: express.Request, res: express.Response, next?: any) => any>): UltraX {
        middlewares.forEach(middleware => this.expressApp.use(middleware));
        return this;
    }

    // Commom used stuff
    public cors(): UltraX {
        this.use(cors());
        return this;
    }

    public bodyParser(): UltraX {
        this.use(bodyParser());
        return this;
    }

    public fileUpload(): UltraX {
        this.use(fileupload());
        return this;
    }

}