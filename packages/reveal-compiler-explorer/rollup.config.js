import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import globals from 'rollup-plugin-node-globals';

export default {
  input: 'src/reveal-compiler-explorer.js',
  output: [
    {
      file: 'dist/reveal-compiler-explorer.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'default'
    },
    {
      file: 'dist/reveal-compiler-explorer.js',
      format: 'iife',
      name: 'RevealCompilerExplorer',
      sourcemap: true,
      exports: 'default'
    },
    {
      file: 'dist/reveal-compiler-explorer.mjs',
      format: 'es',
      sourcemap: true,
      exports: 'default'
    }
  ],
  plugins: [
    commonjs(),
    nodePolyfills(),
    resolve({
      preferBuiltins: true,
      browser: true
    }),
    globals(),
    del({ targets: 'dist/*' })
  ]
};
