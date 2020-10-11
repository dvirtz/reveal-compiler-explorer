import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';


export default {
  input: 'src/compiler-explorer-directives.js',
  output: [
    {
      file: 'dist/compiler-explorer-directives.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/compiler-explorer-directives.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    resolve({ preferBuiltins: false }),
    commonjs(),
    nodePolyfills(
      {
        include: 'process'
      }
    ),
    json(),
    del({ targets: 'dist/*' })
  ]
};
