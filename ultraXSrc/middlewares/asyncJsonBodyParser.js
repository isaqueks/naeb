"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function asyncJsonBodyParser(maxSize) {
    return function (req, res, next) {
        const data = [];
        let usedSize = 0;
        req.body = () => new Promise((resolve, reject) => {
            req.on('end', () => {
                try {
                    const jsonStr = data.join('');
                    const jsonObj = JSON.parse(jsonStr);
                    resolve(jsonObj);
                }
                catch (err) {
                    resolve(null);
                }
            });
            req.on('data', chunk => {
                const chunkStr = String(chunk);
                usedSize += chunkStr.length;
                if (usedSize > maxSize) {
                    req.destroy( /*new Error(`Maximum body payload size exceeded`)*/);
                    reject(new Error(`Maximum body payload size exceeded`));
                    return;
                }
                data.push(chunkStr);
            });
        });
    };
}
exports.default = asyncJsonBodyParser;
