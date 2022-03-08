'use strict';

const semver = require('semver')
const constant = require('./const')
const colors = require('colors')
const log = require('@kathy-test/log')

class CommandInit {
    constructor(argv) {
        if (!argv) {
            throw Error('参数不能为空')
        }
        if (!Array.isArray(argv)) {
            throw Error('参数格式不正确')
        }
        if (argv.length < 1) {
            throw Error('参数不正确')
        }

        this._argv = argv

        this.handleArgv()

        this.pkgName = argv[0]

        const runner = new Promise(() => {
            let chain = Promise.resolve()

            chain = chain.then(() => {
                this.checkNodeVersion()
            })
            chain = chain.then(() => {
                this.init()
            })
            chain = chain.then(() => {
                this.exec()
            })

            chain.catch((err) => {
                log.error(err.message)
            })


        })


    }

    checkNodeVersion() {
        const currentVersion = semver.clean(process.version)
        const lowestVersion = constant.lowestVersion
        if (semver.gte(lowestVersion, currentVersion)) {
            throw new Error(colors.red(`Node.js version is too low. The version you are using is v${lowestVersion}`))
        }
    }

    handleArgv() {
        this._cmd = this._argv[this._argv.length - 1]
        this._other = this._argv.slice(0, this._argv.length - 1)
    }

    init() {
        throw Error('missing init fn')
    }

    exec() {
        throw Error('missing exec fn')
    }
}

module.exports = CommandInit;
