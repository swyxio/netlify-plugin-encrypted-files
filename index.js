const pluginDecrypt = require('./pluginDecrypt');

module.exports = function netlify404nomore(conf) {
  return {
    name: 'netlify-plugin-encrypted-files',
    onInit() {
      console.log('decrypting files');
      pluginDecrypt({});
    }
  };
};
