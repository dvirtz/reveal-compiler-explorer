const path = require('path');

const isDevelopement = typeof process.env.CI === 'undefined';

module.exports = {
  mode: isDevelopement ? "development" : "production",
  devtool: isDevelopement ? 'eval-source-map' : 'source-map',
  target: 'web',
  entry: {
    'reveal-compiler-explorer': './src/reveal-compiler-explorer.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'RevealCompilerExplorer',
      type: 'umd',
      export: 'default'
    },
  }
};
