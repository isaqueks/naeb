"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBodyParser = void 0;
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
};
function setBodyParser(contentType, parser) {
    bodyParsers[contentType.toLowerCase()] = parser;
}
exports.setBodyParser = setBodyParser;
function asyncBodyParser(maxSize) {
    return ((req, res, next) => {
        const data = [];
        let usedSize = 0;
        const contentType = req.headers['content-type'].toLowerCase();
        req.body = (validate) => new Promise((resolve, reject) => {
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
    });
}
exports.default = asyncBodyParser;
