import { HTTPFunctionHandler } from '../api/httpFunctionHandler';

export type BodyValidator = (body?: any) => boolean;
export type AsyncBody = (validate?: BodyValidator) => Promise<any>;

const bodyParsers = {

    'application/json': payload => {
        return JSON.parse(payload);
    },

    'application/x-www-form-urlencoded': payload => {
        
        const obj = {};

        const params = new URLSearchParams(payload);
        
        for (const [k, v] of Array.from(params.entries())) {
            obj[k] = v;
        }

        return obj;
    
    }

}

export function setBodyParser(contentType: string, parser: (payload) => any) {
    bodyParsers[contentType.toLowerCase()] = parser;
}

export default function asyncBodyParser(maxSize: number): HTTPFunctionHandler {
    return ((req, res, next) => {
    
        const data = [];
        let usedSize = 0;

        const contentType = req.headers['content-type'].toLowerCase();

        
        req.body = <T = any>(validate?: BodyValidator) => new Promise<T>((resolve, reject) => {
            
            if (!contentType || !Object.prototype.hasOwnProperty.call(bodyParsers, contentType)) {
                req.destroy();
                reject(new Error(`Unsopported content-type: "${contentType}"`));
                return;
            }

            req.on('end', () => {
                try {
                    const payload = data.join('');
                    const parsedBody = bodyParsers[contentType](payload);
                    if (validate && typeof validate === 'function') {
                        if (!validate(parsedBody)) {
                            return reject(new Error(`Invalid POST body.`));
                        }
                    }
                    resolve(parsedBody);
                }
                catch (err) {
                    return reject(new Error(`Invalid POST body: ${err}`));
                }
            });
            
            req.on('data', chunk => {
                const chunkStr = String(chunk);
                usedSize += chunkStr.length;
                if (usedSize > maxSize) {
                    req.destroy(new Error(`Maximum body payload size exceeded`));
                    reject(new Error(`Maximum body payload size exceeded`));
                    return;
                }
                data.push(chunkStr);
            });
    
        });

        next();
    
    }) as HTTPFunctionHandler;
    
}