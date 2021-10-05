const fs = require('fs');
const path = require('path');

const CLI_RESOURCES = path.join(__dirname, '../cli-resources');

module.exports = (args) => {

    const dirs = [
        'routes',
        'src',
        'src/CRUDs',
        'src/routeTemplates',
        'src/entities'
    ];

    const files = {
        [path.join(CLI_RESOURCES, 'exampleRoute.ts')]: 'routes/index.ts',
        [path.join(CLI_RESOURCES, 'server.ts')]: 'server.ts',
    }

    dirs.forEach(_dir => {
        const dir = path.join(process.cwd(), _dir);
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
        const outPath = path.join(process.cwd(), files[file]);
        try {
            if (!fs.existsSync(outPath)) {
                fs.copyFileSync(file, outPath)
            }
        }
        catch (err) {
            console.error(`Unable to copy initial file ${file} to ${outPath}!`, err);
        }
    }

}