import ApiCall from "./apiCall";
import ApiRoute from "./apiRoute";

import fs = require('fs');
import path = require('path');

const routes: ApiCall[] = [];
const workingRoutes: ApiRoute[] = [];

function startRoutes(app) {
    for (let route of routes) {
        console.log(`${route.method.toUpperCase()}\t${route.route}`);
        workingRoutes.push(new ApiRoute(route, app));
    }
}

function manageRoutes(app, dirPath: string, start = true, namesToIgnore = ['tmp']) {
    const files: string[] = fs.readdirSync(dirPath);

    for (let file of files) {
        if (namesToIgnore.includes(file)) {
            continue;
        }

        const abs = path.join(dirPath, file);

        if (fs.lstatSync(abs).isDirectory()) {
            manageRoutes(app, abs, false);
        }
        else if (file.endsWith('.ts') || file.endsWith('.js')) {
            const api: ApiCall = require(abs);
            if (!api || !(api instanceof ApiCall)) {
                console.log(`ERR: "${abs}" is not an ApiCall!`);
            }
            else {
                routes.push(api);
            }
        }
    }

    start && startRoutes(app);
}

export { manageRoutes };