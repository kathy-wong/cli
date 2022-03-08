'use strict';

const log = require('@kathy-test/log')
const command = require('@kathy-test/command')
module.exports = init;

function init(argv) {
    log.verbose('init')

    return new commandInit(argv)

    // console.log('process',process)

    // TODO
}

class commandInit extends command{
    init(){
        console.log('init')
    }
    exec(){
        console.log('exec')
    }
}
