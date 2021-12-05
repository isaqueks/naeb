import RouteManager from "../naebSrc/routeManager";
import express = require('express');
import path from 'path';
import fs from 'fs';

describe('RouteManager class test', () => {

    const app = {
        get: function(req, res) {

        }
    } as express.Application;
    const routesDir = path.join(__dirname, './testRoutes');

    test('RouteManager#constructor', () => {


        const existsMock = jest.spyOn(fs, 'existsSync');

        const statMock = jest.spyOn(fs, 'statSync');
        
        const mgr = new RouteManager(app, routesDir);
        expect(existsMock).toHaveBeenCalledWith(routesDir);
        expect(statMock).toHaveBeenCalledWith(routesDir);

        expect(mgr.paths).toEqual([routesDir]);
        expect(mgr['app']).toBe(app);


    });

    test('RouteManager#scanRoutes', async () => {

        const mgr = new RouteManager(app, routesDir);
        await mgr.scanRoutes();
        expect(mgr['routes']).toHaveLength(1);
        expect(mgr['routes'][0].route).toEqual('/test_route');

    });

    test('RouteManager#add', async () => {

        const mgr = new RouteManager(app, routesDir);

        const route = mgr.add({
            handler: jest.fn(),
            route: '/index.html',
            method: 'GET'
        });

        const route2 = mgr.add({
            handler: jest.fn(),
            route: '/',
            method: 'get'
        });

        expect(mgr['routes']).toEqual([ route, route2 ]);

    });

    test('RouteManager#startRoute', () => {

        const mgr = new RouteManager(app, routesDir);
        const route = mgr.add({
            handler: jest.fn(),
            route: '/index.html',
            method: 'GET'
        });

        mgr.startRoute(route);
        expect(mgr['workingRoutes'][0].call).toBe(route);

        // Shouldn't start the route twice
        mgr.startRoute(route);
        expect(mgr['workingRoutes'].length).toEqual(1);

    });

    test('RouteMananger#resolveRoutePath', () => {

        const mgr = new RouteManager(app, routesDir);

        expect(mgr['resolveRoutePath']('/inexistent/directory', '/inexistent', 'route.ts'))
        .toEqual('/directory/route');

        expect(mgr['resolveRoutePath']('inexistent\\\\directory\\', './inexistent', 'route.ts'))
        .toEqual('/directory/route');

        expect(mgr['resolveRoutePath']('/inexistent/directory', '/inexistent', 'index.ts'))
        .toEqual('/directory/');

        expect(mgr['resolveRoutePath']('inexistent\\\\directory\\', './inexistent', 'index.js'))
        .toEqual('/directory/');

    });

});