import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import del from 'rollup-plugin-delete';

export default {
  input: 'src/reveal-compiler-explorer.js',
  output: [
    {
      file: 'dist/reveal-compiler-explorer.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/reveal-compiler-explorer.js',
      format: 'iife',
      name: 'RevealCompilerExplorer',
      sourcemap: true
    },
    {
      file: 'dist/reveal-compiler-explorer.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    nodePolyfills(),
    del({ targets: 'dist/*' })
  ]
};
