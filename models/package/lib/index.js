'use strict';
const path = require('path')
const utils = require("@kathy-test/utils")
const pkgDir = require('pkg-dir').sync
const formatPath = require('@kahty-test/format-path')
const npminstall = require('npminstall')
const {getDefaultRegistry, getNpmLatestVersion} = require('@kathy-test/get-npm-info')
const log = require('@kahty-test/log')
const fse = require('fs-extra')

const pathExists = require('path-exists').sync


class Package {
    constructor(options) {
        if (!options) {
            throw Error('package:empty options are not allowed')
        }


        if (!utils.isObject(options)) {
            throw  Error('package:Non-object are not allowed')
        }
        this.targetPath = options.targetPath
        this.homePath = options.homePath
        this.storePath = options.storePath
        this.pkgName = options.pkgName
        this.version = options.version
        this.cacheFilePathPrefix = this.pkgName.replace('/', '_')
        console.log('init pkg')

        // this.path = options.path
    }

    async prepare() {
        if(this.storePath&&pathExists(this.storePath)){
            fse.mkdirsSync(this.storePath)
        }
        if (this.version === 'latest') {
            this.version = await getNpmLatestVersion(this.pkgName)
        }
    }

    async install() {
        await this.prepare()
        log.verbose(this.targetPath)
        log.verbose(this.storePath)
        log.verbose('install start')

        npminstall({
            root: this.targetPath,
            pkgs: [
                {name: '@kathy-test/init', version: this.version}
            ],
            registry: getDefaultRegistry(),
            storeDir: this.storePath
        }).catch(e => {
            console.log(e)
        })

    }

    async update() {
        console.log('update init')
        await this.prepare()
        const latestVersion = await getNpmLatestVersion(this.pkgName)
        const latestVersionPath = this.latestVersionPath(latestVersion)
        if(!pathExists(latestVersionPath)){
            await npminstall({
                root: this.targetPath,
                pkgs: [
                    {name: '@kathy-test/init', version: latestVersion}
                ],
                registry: getDefaultRegistry(),
                storeDir: this.storePath
            }).catch(e => {
                console.log(e)
            })
            this.version = latestVersion
        }
    }

    get cacheFilePath() {
        return path.resolve(this.storePath, `_${this.cacheFilePathPrefix}@${this.version}@${this.pkgName}`)
    }

    latestVersionPath(latestVersion){
        return path.resolve(this.storePath, `_${this.cacheFilePathPrefix}@${latestVersion}@${this.pkgName}`)
    }

    async exist() {
        if (this.storePath) {
            await this.prepare()
            log.verbose(`path is ${this.cacheFilePath}`)
            return pathExists(this.cacheFilePath)

        } else {
            return pathExists(this.targetPath)
        }

    }

    getRootFilePath() {
        function _getRootFile(targetPath){
            const dir = pkgDir(targetPath)
            if (dir) {
                const dirFile = require(path.resolve(dir, 'package.json'))
                if (dirFile && dirFile.main) {
                    return formatPath(path.resolve(dir, dirFile.main))
                }
            }
        }

        if(this.storePath){
            return _getRootFile(this.storePath)
        }else{
            return _getRootFile(this.targetPath)
        }



    }
}

module.exports = Package;