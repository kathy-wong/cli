'use strict';
const path = require('path')
const Package = require('@kahty-test/package')
const dir = require("pkg-dir").sync
const log = require('@kahty-test/log')
const cp = require("child_process")

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
        targetPath = path.resolve(homePath, CACHE_DIR)
        storePath = path.resolve(targetPath, 'node_modules')
        const pkg = new Package({
            targetPath,
            name,
            pkgName,
            version,
            storePath
        })
        log.verbose(`targetPath ${targetPath}`)
        log.verbose(`storePath ${storePath}`)


        if (pkg.exist()) {
            log.verbose('exist update')
            pkg.update()
        } else {
            log.verbose('install')
            pkg.install()
        }
    } else {
        const pkg = new Package({
            targetPath,
            name,
            pkgName,
            version
        })

        const rootPath = pkg.getRootFilePath()
        if (rootPath) {
            log.verbose(`rootpath is ${rootPath}`)

            let args =Array.from(arguments)
                let o = Object.create(null)
            let cmd = args[args.length-1]

            Object.keys(cmd).forEach(key=>{
                if(cmd.hasOwnProperty(key)&&!key.startsWith('_')&&key!=='parent'){
                    o[key] = cmd[key]
                }
            })
            args[args.length-1] = o


            //
            const code = `require('${rootPath}').call(null, ${JSON.stringify(args)})`

            const cd = spawn('node',['-e',code],{
                cwd:process.cwd(),
                stdio:'inherit'
            })
            cd.on('error',(err)=>{
                log.error(`err ${err}`)
            })
            cd.on('exit',(err)=>{
                log.verbose('执行完成')
            })


            // console.log('Array.from(arguments)',Array.from(arguments))

        }

    }


    // TODO
}


function spawn(command, argv, options) {
    const cmd = process.platform === 'win32' ? 'cmd' : command
    const newArgv = process.platform === 'win32' ? ['c'].concat(command
    ,argv) : argv

    return cp.spawn(cmd, newArgv, options||{})
}