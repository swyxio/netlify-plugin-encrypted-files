const fs = require('fs');
const path = require('path');

// actual test
const netlifyPlugin = require('../index.js');
test('plugin fixture works', async () => {
  expect(async () => {
    process.env.NETLIFY_ENCRYPT_KEY = 'test';
    const initPlugin = netlifyPlugin();
    console.log(`running ${initPlugin.name}`);
    initPlugin.onPreBuild();
  }).not.toThrow();
});
