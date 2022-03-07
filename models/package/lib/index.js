'use strict';
const path = require('path')
const utils = require("@kathy-test/utils")
const pkgDir = require('pkg-dir').sync
const formatPath = require('@kahty-test/format-path')
const npminstall = require('npminstall')
const {getDefaultRegistry,getNpmLatestVersion} = require('@kathy-test/get-npm-info')
const log = require('@kahty-test/log')

const pathExists = require('path-exists').sync



class Package{
    constructor(options) {
        if(!options){
            throw Error('package:empty options are not allowed')
        }


        if(!utils.isObject(options)){
            throw  Error('package:Non-object are not allowed')
        }
        console.log('init pkg')
        this.targetPath = options.targetPath
        this.homePath = options.homePath
        this.storePath = options.storePath
        this.pkgName = options.pkgName
        this.version=options.version
        // this.path = options.path
    }
    async prepare(){
        if(this.version==='latest'){
            this.version =  await getNpmLatestVersion(this.pkgName)
        }
    }
    async install(){
        await this.prepare()
        log.verbose(this.targetPath)
        log.verbose(this.storePath)
        log.verbose('install start')

        npminstall({
            root:this.targetPath,
            pkgs:[
                {name:'init',version:'1.0.0' }
            ],
            registry:getDefaultRegistry(),
            storeDir:this.storePath
        }).catch(e=>{
            console.log(e)
        })

    }
    async update(){
        console.log('upaet init')
        console.log(await getNpmLatestVersion(this.pkgName).then().catch())
    }
     exist(){
        // if(this.storePath){
        //
        // }else{
           return  pathExists(this.targetPath)
        // }

    }
    getRootFilePath(){
const dir = pkgDir(this.targetPath)
        if(dir){
            const dirFile = require(path.resolve(dir,'package.json'))
            console.log('dirfile',dirFile)
            if(dirFile&&dirFile.main){
                return formatPath(path.resolve(dir,dirFile.main))
            }
        }
        console.log(dir)
    }
}
module.exports = Package;