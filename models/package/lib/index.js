'use strict';

const utils = require("@kathy-test/utils")



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
        // this.version=options.version
        // this.path = options.path
    }
    install(){

    }
    update(){

    }
}
module.exports = Package;