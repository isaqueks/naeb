import express = require('express');
import crypto = require('crypto');
import stream from 'stream';
import asyncJsonBodyParser from '../ultraXSrc/middlewares/asyncJsonBodyParser';

test('asyncJsonBodyParser', async () => {

    const obj = {
        user: {
            name: 'Isaque',
            github: 'isaqueks'
        }
    }
    
    const workingPayload = JSON.stringify(obj);
    const tooLargePayload = crypto.randomBytes(100 * 1024).toString();
    const brokenPayload = '{ this is a non working and broken json';

    const fakeRequest = (data) => {

        let endCb;

        return {
            cbEnd: null,
            on: (ev: string, cb: Function) => {
                if (ev === 'end') {
                    endCb = cb;
                }
                else if (ev === 'data') {
                    cb(data);
                    endCb && endCb();
                }
            },
            destroy: (err) => {}

        } as any as express.Request;
    }

    let fakeReq: express.Request = fakeRequest(workingPayload);
    asyncJsonBodyParser(10 * 1024)(fakeReq, null, () => {});

    expect(await fakeReq.body()).toEqual(obj);

    expect(async () => {
        fakeReq = fakeRequest(tooLargePayload);
        asyncJsonBodyParser(10 * 1024)(fakeReq, null, () => {});
        await fakeReq.body();
    }).rejects.toThrow('Maximum body payload size exceeded');


    fakeReq = fakeRequest(brokenPayload);
    asyncJsonBodyParser(10 * 1024)(fakeReq, null, () => {});
    expect(await fakeReq.body()).toBeNull();


});