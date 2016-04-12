/* eslint-env node */
import * as path from 'path';

export default {
  entry: 'main',
  devtool: 'source-map',
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
    filename: 'prescribe.js',
    sourceMapFilename: 'prescribe.js.map',
    library: 'Prescribe',
    libraryTarget: 'umd'
  }
};
