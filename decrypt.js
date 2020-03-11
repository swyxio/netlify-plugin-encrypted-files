#!/usr/bin/env node
'use strict';

const sade = require('sade');

const pluginDecrypt = require('./pluginDecrypt');

sade('decrypt', true)
  .version('0.0.1')
  .describe('Decrypt files. Expects a linked site and a .encrypt folder.')
  .example('decrypt')
  .option(
    '-t, --testdecrypt',
    'decrypt to a .testdecrypt folder instead of overwriting'
  )
  .action((opts) => {
    // remember, if you add an arg to decrypt, the signature of the .action callback changes to add that arg too
    pluginDecrypt(opts);
  })
  .parse(process.argv);
