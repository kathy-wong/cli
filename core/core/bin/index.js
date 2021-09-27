#! /usr/bin/env node

const importLocal = require('import-local')
console.dir(importLocal())

if(importLocal(__filename)){
    require('npmlog').info('cli','use import loaca')
}else{
    require('../lib')(process.argv.slice(2))
}