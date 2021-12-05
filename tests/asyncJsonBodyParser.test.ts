import express from 'express';
import crypto = require('crypto');
import asyncBodyParser, { AsyncBody } from '../ultraXSrc/middlewares/asyncBodyParser';


describe('asyncJsonBodyParser', () => {

    const fakeRequest = (data, ctype = 'application/json') => {

        let endCb;

        return {

            headers: {
                'content-type': ctype
            },

            cbEnd: null,
            on: (ev: string, cb: Function) => {
                if (ev === 'end') {
                    endCb = cb;
                }
                else if (ev === 'data') {
                    const chunks = data.split('');
                    chunks.forEach(c => cb(c));
                    endCb && endCb();
                }
            },
            destroy: (err) => { }

        } as any as express.Request<any, any, AsyncBody>;
    }

    test('body() json', async () => {

        const obj = {
            user: {
                name: 'Isaque',
                github: 'isaqueks'
            }
        }

        const workingPayload = JSON.stringify(obj);
        let fakeReq = fakeRequest(workingPayload, 'application/json');
        asyncBodyParser(10 * 1024)(fakeReq, null, () => { 
            expect(fakeReq.body()).resolves.toEqual(obj);
        });


    });

    test('body() urlencoded', async () => {

        const req = fakeRequest('name=Isaque&github=isaqueks', 'application/x-www-form-urlencoded');

        asyncBodyParser(1024)(req, null, () => { });

        const body = await req.body();

        expect(body).toEqual({
            name: 'Isaque',
            github: 'isaqueks'
        })

    });

    test('body() invalid content-type', () => {

        /**
         * This will also test if it prevent's from acessing __proto__ on
         * the how to handle dictionary
         */
        const req = fakeRequest('name=Isaque&github=isaqueks', '__proto__');

        expect(async () => {
            asyncBodyParser(1024)(req, null, async () => { });
            await req.body();
        }).rejects.toBeInstanceOf(Error);

    });

    test('body() validation', () => {

        const validate = body => {
            return (body && (typeof body.number === 'number') && (typeof body.string === 'string'));
        };

        expect(async () => {
            const req = fakeRequest(JSON.stringify({
                string: 'i am a string',
                number: 'this should be a number'
            }), 'application/json');
            asyncBodyParser(1024)(req, null, () => { });
            await req.body(validate);
        }).rejects.toBeInstanceOf(Error);


        const req = fakeRequest(JSON.stringify({
            string: 'i am a string',
            number: 10
        }), 'application/json');

        asyncBodyParser(1024)(req, null, () => {
            expect(req.body(validate)).resolves.toEqual({
                string: 'i am a string',
                number: 10
            })
        });

    });


    test('broken payload', async () => {
        const tooLargePayload = crypto.randomBytes(100 * 1024).toString();
        const brokenPayload = '{ this is a non working and broken json';

        expect(async () => {
            const fakeReq = fakeRequest(tooLargePayload);
            asyncBodyParser(10 * 1024)(fakeReq, null, () => { });
            await fakeReq.body();
        }).rejects.toThrow('Maximum body payload size exceeded');


        expect(async () => {
            const fakeReq = fakeRequest(brokenPayload);
            asyncBodyParser(10 * 1024)(fakeReq, null, () => { });
            await fakeReq.body();
        }).rejects.toThrow();

    });

});