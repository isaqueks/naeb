import express from "express";
import RouteManager from "../naebSrc/routeManager";
import fs from 'fs';

test('Test RouteExecutor', async () => {

    const app = {
        get: function(req, res) {

        }
    } as express.Application;

    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'statSync').mockImplementation(() => { return { isDirectory: () => true } as any});

    const mgr = new RouteManager(app, '');

    let a, b, c, d;

    const route = mgr.add({
        handler: jest.fn(),
        route: '/index.html',
        method: 'GET',
        template: [
            (route, req, res, next) => {
                a = true;
                next();
            },
            (route, req, res, next) => {
                b = true;
                next();
            },
            (route, req, res, next) => {
                c = true;
                next();
            }
        ]
    });

    const route2 = mgr.add({
        handler: jest.fn(),
        route: '/',
        method: 'get',
        template: 
            (route, req, res, next) => {
                d = true;
                next();
            }
        
    });

    expect(mgr['routes']).toEqual([ route, route2 ]);

    mgr.startRoutes();
    expect(mgr['workingRoutes']).toHaveLength(2);

    await mgr['workingRoutes'][0]['onRequest'](null, null, jest.fn());
    await mgr['workingRoutes'][1]['onRequest'](null, null, jest.fn());

    expect(a).toBe(true);
    expect(b).toBe(true);
    expect(c).toBe(true);
    expect(d).toBe(true);


});