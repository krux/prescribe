/* eslint-env node */
import path from 'path';
import pkg from './package.json';

export default {
  entry: 'main',
  resolve: {
    root: path.resolve('./src')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve('./src'),
          path.resolve('./test')
        ],
        loaders: ['babel']
      }
    ]
  },
  output: {
    filename: `${pkg.name}.js`,
    library: 'Prescribe',
    libraryTarget: 'umd'
  }
};
