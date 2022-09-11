const path = require('path');

const isDevelopement = typeof process.env.CI === 'undefined';

module.exports = {
  mode: isDevelopement ? "development" : "production",
  devtool: isDevelopement ? 'eval-source-map' : 'source-map',
  entry: {
    'compiler-explorer-directives': './src/compiler-explorer-directives.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'compiler-explorer-directives.cjs',
    clean: true,
    library: {
      type: 'commonjs-static'
    },
  }
};
