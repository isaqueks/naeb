#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const allCommands = require('./cli/cli-commands/all-commands.js');

const cliArgs = process.argv.slice(2);
if (!cliArgs || cliArgs.length === 0) {
    console.error('No args! Run ultrax help');
}

const [ command, ...args ] = cliArgs;
if (!allCommands[command]) {
    console.error(`Invalid command "${command}".`);
}
else {
    allCommands[command](args);
}
