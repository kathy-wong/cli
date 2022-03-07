#! /usr/bin/env node
'use strict'

module.exports = core
const path = require('path')
const log = require('@kathy-test/log')
const pkg = require('../package.json')
const constant = require('./const.js')
const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('userhome')()
const { Command } = require('commander')
const { getServerNpmVersions } = require('@kathy-test/getNpmInfo')
const init = require('@kathy-test/init')
const exec = require('@kathy-test/exec')



const program = new Command()

const pathExists = require('path-exists').sync

async function core(argv) {
  // TODO
  try {
    checkNodeVersion()
    checkPackageVersion()
    checkRoot()
    checkUserHome()
    // checkInputArgv()
    checkEnv()
    await checkoutGlobalUpdate()

    registerCommand()
  } catch (error) {
    console.log(error,'error')
    // log.error(error)
    if (program.debug) {
      console.log(error)
    }
  }
}

function registerCommand() {
  console.log('registerCommand')
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式')
    .option('-tp, --targetPath <type>', '是否指定本地调试文件路径', '');

  // 指定targetPath
  program.on('option:targetPath', function() {
    process.env.CLI_TARGET_PATH = program._optionValues.targetPath;
  });

  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目')
      .action( exec)

  // 开启debug模式
  program.on('option:debug', function() {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose'
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
    log.verbose('test', 'debug mode')
  });


  // 对未知命令监听
  program.on('command:*', function(obj) {
    const availableCommands = program.commands.map(cmd => cmd.name());
    console.log(colors.red('未知的命令：' + obj[0]));
    if (availableCommands.length > 0) {
      console.log(colors.red('可用命令：' + availableCommands.join(',')));
    }
  });



  program.parse(process.argv);

  if (program.args && program.args.length < 1) {
    program.outputHelp();
    console.log();
  }


}

async function checkoutGlobalUpdate() {
  const packageName = pkg.name
  const version = pkg.version
  const data = await getServerNpmVersions(version, packageName)
  log.verbose('version is', version)
  if (!data) {
    // log.error('version warning', 'lost version')
  }
  if (data && semver.gt(data, version)) {
    log.warn('更新提示', colors.yellow(`当前版本${version}不是最新版本，最新版本为${data},请升级`))
  }
}

function checkEnv() {
  const dotenv = require('dotenv')

  const dotenvPath = path.resolve(userHome, '.env')

  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    })
  }
  createDefaultConfig()
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome
}

function checkInputArgv() {
  const argv = require('minimist')(process.argv.slice(2))
  if (argv.debug) {
    process.env.LOG_LEVEL = 'verbose'
  } else {
    process.env.LOG_LEVEL = 'info'
  }
  log.level='verbose'
  // log.level = process.env.LOG_LEVEL
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('path not exists'))
  }
}
function checkRoot() {
  const checkRoot = require('root-check')
  checkRoot()
}
function checkNodeVersion() {
  const currentVersion = semver.clean(process.version)
  const lowestVersion = constant.lowestVersion
  if (semver.gte(lowestVersion, currentVersion)) {
    throw new Error(colors.red(`Node.js version is too low. The version you are using is v${lowestVersion}`))
  }
}

function checkPackageVersion() {
  // "silly" | "verbose" | "info" | "timing" | "http" | "notice" | "warn" | "error" | "silent";
  
  log.success('test success')
  log.verbose('vtest')

  log.notice('cli', pkg.version)
}
