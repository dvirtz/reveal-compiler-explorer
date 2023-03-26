const path = require('path');

const isDevelopement = typeof process.env.CI === 'undefined';

const commonConfig = {
  mode: isDevelopement ? "development" : "production",
  devtool: isDevelopement ? 'eval-source-map' : 'source-map',
  resolve: {
    extensions: ['.js'],
  },
};

const webConfig = {
  ...commonConfig,
  target: 'web',
  entry: {
    'compiler-explorer-directives': './src/compiler-explorer-directives.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].cjs',
    library: {
      type: 'commonjs-static'
    },
  }
};

const nodeConfig = {
  ...commonConfig,
  target: 'node',
  entry: {
    'compiler-explorer-directives.node': './src/compiler-explorer-directives.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].cjs',
    library: {
      type: 'commonjs-static'
    },
  }
};

module.exports = [
  webConfig, 
  nodeConfig,
];
