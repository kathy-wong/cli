'use strict';


const log = require('npmlog')
// log.level = process.env.LOG_LEVEL?process.env.LOG_LEVEL:'info'
log.addLevel('success',{fg:'white',bg:'green',blob:true})
log.heading = 'kathy-test'
log.headingStyle={bg:'white',fg:'blue'}

module.exports = log;
