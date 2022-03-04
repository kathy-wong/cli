'use strict'

const axios = require('axios')
const semver = require('semver')
const urlJoin = require('url-join')

module.exports = {
  getServerNpmVersions,
}

function getNpmInfo(pkgName, registry) {
  if (!pkgName) return null
  const registryUrl = registry || getDefaultRegistry()

  const npmInfoUrl = urlJoin(registryUrl, pkgName)
  console.log(npmInfoUrl)
  return axios
    .get(npmInfoUrl)
    .then((res) => {
      if (res.status === 200) {
        return res.data
      }
      return null
    })
    .catch((err) => {
      return Promise.reject(null)
    })
  // TODO
}

async function getNpmVersions(pkgName, registry) {
  const data = await getNpmInfo(pkgName, registry)
  return Object.keys(data.versions) || []
}

async function getSemverVersions(baseVersion, versions) {
  const version = versions
    .filter((v) => {
      return semver.satisfies(v, `>${baseVersion}`)
    })
    .sort((a, b) => (semver.gt(b, a) ? 1 : -1))
  return version
}

async function getServerNpmVersions(baseVersion, pkgName, registry) {
  const versions = await getNpmVersions(pkgName, registry)

  const newVersion = await getSemverVersions(baseVersion, versions)

  console.log(versions,'v',newVersion)

  if (newVersion && newVersion.length > 0) return newVersion[0]

  return null
}
function getDefaultRegistry(isOriginal = true) {
  return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org'
}
