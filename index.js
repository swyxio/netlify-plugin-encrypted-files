const pluginDecrypt = require('./pluginDecrypt')

module.exports = {
  name: '@netlify/plugin-encrypted-files',
  // scopes: ['listSites'],
  onInit() {
    console.log('decrypting files')
    pluginDecrypt()
  },
}
