'use strict';

const Package = require('@kahty-test/package')
const dir = require("pkg-dir").sync

const SETTINGS = {
    init:'@kathy-test/init'
}
module.exports = exec;

function exec() {
    const argObj = arguments[arguments.length-1]
    console.log('argObj',argObj._name)

    const options= {
        targetPath:process.env.CLI_TARGET_PATH,
        homePath:process.env.CLI_HOME_PATH,
        name:argObj._name,
        packageName:SETTINGS[name],
        version:'latest'
    }
    const pkg = new Package(options)


    // TODO
}
