const pluginDecrypt = require('./pluginDecrypt');
const chalk = require('chalk');

module.exports = function netlify404nomore(conf) {
  return {
    onInit({ pluginConfig: { branches } }) {
      console.log('decrypting files');
      if (branches && branches.includes(process.env.BRANCH)) {
        pluginDecrypt({});
      } else if (typeof branches === 'undefined') {
        pluginDecrypt({});
      } else {
        console.log(
          'branches specified',
          chalk.yellow(branches.join(' ')),
          `but our current branch is ${chalk.blue(
            process.env.BRANCH
          )}, skipping decryption`
        );
      }
    }
  };
};
