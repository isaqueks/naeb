import RouteManager from "../ultraXSrc/routeManager";
import express = require('express');
import path from 'path';
import fs from 'fs';

describe('RouteManager class test', () => {

    const app = {
        get: function(req, res) {

        }
    } as express.Application;
    const routesDir = '/test/dir';

    test('RouteManager#constructor', () => {


        const existsMock = jest.spyOn(fs, 'existsSync');
        existsMock.mockImplementation(() => true);

        const statMock = jest.spyOn(fs, 'statSync');
        const statMockObj = { 
            isDirectory() { return true }
        };
        statMock.mockImplementation(() => (statMockObj) as any);
        const isDirMock = jest.spyOn(statMockObj, 'isDirectory');
        
        const mgr = new RouteManager(app, routesDir);
        expect(existsMock).toHaveBeenCalledWith(routesDir);
        expect(statMock).toHaveBeenCalledWith(routesDir);
        expect(isDirMock).toHaveBeenCalled();

        expect(mgr.paths).toEqual([routesDir]);
        expect(mgr['app']).toBe(app);


    });

    test('RouteManager#add', () => {

        const mgr = new RouteManager(app, routesDir);
        const route = mgr.add({
            apiFn: jest.fn(),
            route: '/index.html',
            method: 'get'
        });

        expect(mgr['routes']).toEqual([ route ]);

    });

    test('RouteManager#startRoute', () => {

        const mgr = new RouteManager(app, routesDir);
        const route = mgr.add({
            apiFn: jest.fn(),
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