import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';


export default {
  input: 'src/compiler-explorer-directives.js',
  output: [
    {
      file: 'dist/compiler-explorer-directives.cjs',
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    json(),
    del({ targets: 'dist/*' })
  ],
  external: [
    'bent',
    'promise-retry',
    'ansi-colors'
  ]
};
