require('babel-register');
var process = require('process');

process.chdir('..');

module.exports = require('./karma-nocoverage.config.babel');
