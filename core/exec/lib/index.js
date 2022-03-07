'use strict';
const path = require('path')
const Package = require('@kahty-test/package')
const dir = require("pkg-dir").sync
const log = require('@kahty-test/log')

const SETTINGS = {
    init: '@kathy-test/init'
}
const CACHE_DIR = 'dependencies'
module.exports = exec;

 function exec() {
    const argObj = arguments[arguments.length - 1]
    console.log('argObj', argObj._name)

    let targetPath = process.env.CLI_TARGET_PATH,
        homePath = process.env.CLI_HOME_PATH,
        name = argObj._name,
        pkgName = SETTINGS[argObj._name],
        version = 'latest',
    storePath = ''
    log.verbose(`targetPath is ${targetPath}`)


    if (!targetPath) {
        targetPath = path.resolve(homePath,CACHE_DIR)
        storePath = path.resolve(targetPath,'node_modules')
        const pkg = new Package({
            targetPath,
            name,
            pkgName,
            version,
            storePath
        })
        log.verbose(`targetPath ${targetPath}`)
        log.verbose(`storePath ${storePath}`)



        if(pkg.exist()){
            log.verbose('update')
            // pkg.update()
            pkg.install()
        }else{
            // log.verbose('install')
            // pkg.install()
        }
    }else{
        const pkg =new Package({
            targetPath,
            name,
            pkgName,
            version
        })

        const rootPath = pkg.getRootFilePath()
        if(rootPath){
            log.verbose(`rootpath is ${rootPath}`)
            require(rootPath).apply(null,arguments)

        }

    }





    // TODO
}
