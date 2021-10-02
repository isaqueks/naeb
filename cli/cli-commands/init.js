const fs = require('fs');
const path = require('path');

const CLI_RESOURCES = path.join(__dirname, '../cli-resources');

module.exports = (args) => {

    const dirs = [
        'routes',
        'src',
        'CRUDs',
        'routeTemplates',
        'entities'
    ];

    const files = {
        [path.join(CLI_RESOURCES, 'exampleRoute.ts')]: 'routes/index.ts',
        [path.join(CLI_RESOURCES, 'server.ts')]: 'server.ts',
    }

    dirs.forEach(dir => {
        try {
            fs.accessSync(dir);
        }
        catch {
            try {
                fs.mkdirSync(dir);
            }
            catch (err) {
                console.error(`Unable do create directory ${dir}!`, err);
            }
        }
    });

    for (const file in files) {
        const outPath = files[file];
        try {
            fs.copyFileSync(file, outPath)
        }
        catch (err) {
            console.error(`Unable to copy initial file ${file} to ${outPath}!`, err);
        }
    }

}