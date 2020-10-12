import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';

export default {
  input: 'src/reveal-test.js',
  output: [
    {
      file: 'dist/reveal-test.cjs',
      format: 'cjs',
    }
  ],
  plugins: [
    json(),
    del({ targets: 'dist/*' })
  ],
  external: [
    'compiler-explorer-directives',
    'markdown-it',
    'fs',
    'fs/promises'
  ]
};
