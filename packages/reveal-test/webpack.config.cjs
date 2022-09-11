const path = require('path');

const isDevelopement = typeof process.env.CI === 'undefined';

module.exports = {
  mode: isDevelopement ? "development" : "production",
  devtool: isDevelopement ? 'eval-source-map' : 'source-map',
  entry: {
    'reveal-test': './src/reveal-test.js',
  },
  resolve: {
    fallback: {
        'fs': false
    },
    extensions: ['.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'reveal-test.cjs',
    clean: true,
    library: {
      type: 'commonjs'
    },
  }
};
