const fs = require('fs');
const path = require('path');

const CLI_RESOURCES = path.join(__dirname, '../cli-resources');

function fixPath(finalpath) {
    const fileName = path.basename(finalpath);
    return path.join(
        finalpath.substring(0, finalpath.length - fileName.length),
        fileName[0].toLowerCase() + fileName.substring(1)
    );
}

const createTemplate = (resourceItem, finalpath, templateKeys) => {
    try {
        const absResource = path.join(CLI_RESOURCES, resourceItem);
        let template = fs.readFileSync(absResource).toString();
        for (const key in templateKeys) {
            const value = templateKeys[key];
            template = template.split(`__${key}__`).join(value);
        }
        fs.writeFileSync(path.join(process.cwd(), finalpath), template);
    }
    catch (err) {
        console.error(`Unable to create resource from template!`, err);
    }
}

function validateName(name, allowPath) {

    const validChars = ('_abcdefghijklmnopqrstuvwxyz0123456789'+'abcdefghijklmnopqrstuvwxyz'.toUpperCase()).split('');
    if (allowPath) {
        validChars.push('/');
    }
    for (const ch of name) {
        if (!validChars.includes(ch)) {
            console.log(ch);
        }
    }

    return true;

}

function throwInvalidName(name) {
    throw new Error(`Invalid name "${name}". Only numbers, letters and underscores are allowed!`);
}

const typesHandler = {

    'route': (name) => {
        if (!validateName(name, true)) {
            throwInvalidName(name);
        }
        if (name.includes('tmp')) {
            throw new Error(`Name cannot include "tmp".`);
        }
        const finalPath = fixPath(path.join(`routes/${name}.ts`));
        createTemplate('newRoute.ts', finalPath, {});
        console.log(`Route created at "${finalPath}".`);
    },

    'entity': (name) => {
        if (!validateName(name, false)) {
            throwInvalidName(name);
        }
        const finalPath = fixPath(path.join(`entities/${name}.ts`));
        createTemplate('newEntity.ts', finalPath, {
            NAME: name
        });
        console.log(`Entity created at "${finalPath}".`);
    },

    'crud': (name) => {
        if (!validateName(name, false)) {
            throwInvalidName(name);
        }
        const finalPath = fixPath(path.join(`CRUDs/${name}.ts`));
        createTemplate('newCrud.ts', finalPath, {
            NAME: name
        });
        console.log(`CRUD created at "${finalPath}".`);
    },

    'template': (name) => {
        if (!validateName(name, false)) {
            throwInvalidName(name);
        }
        const finalPath = fixPath(path.join(`routeTemplates/${name}.ts`));
        createTemplate('newTemplate.ts', finalPath, {
            NAME: name
        });
        console.log(`Route template created at "${finalPath}".`);
    }

}

module.exports = (args) => {

    const [ type, name ] = args;
    if (!type || !name) {
        return console.error(`No "type" or "name" argument! Got "${args}".`);
    }

    const handler = typesHandler[type];
    if (!handler) {
        return console.error(`Invalid item type "${type}". Valid types are: ${Object.keys(typesHandler)}`);
    }

    try {
        handler(name);
    }
    catch (err) {
        return console.error(err);
    }

};