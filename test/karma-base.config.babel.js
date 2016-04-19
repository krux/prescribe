/* eslint-env node */
import pkg from '../package.json';
import webpackConfig from '../webpack.config.babel.js';

export default {
  basePath: '',

  browserDisconnectTimeout: 20000, // ms

  browserDisconnectTolerance: 2, // times

  browserNoActivityTimeout: 60000, // ms

  frameworks: [
    'mocha',
    'sinon',
    'expect'
  ],

  files: [
    '**/*.spec.js'
  ],

  exclude: [],

  preprocessors: {
    '**/*.js': ['webpack']
  },

  babelPreprocessor: {
    options: pkg.babel
  },

  reporters: [
    'mocha'
  ],

  port: 9876,

  colors: true,

  logLevel: 'debug',

  autoWatch: false,

  browsers: [
    'PhantomJS'
  ],

  singleRun: true,

  webpack: webpackConfig,

  webpackMiddleware: {
    noInfo: true
  },

  concurrency: Infinity
};
