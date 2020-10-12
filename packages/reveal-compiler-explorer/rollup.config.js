import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import del from 'rollup-plugin-delete';

export default {
  input: 'src/reveal-compiler-explorer.js',
  output: [
    {
      file: 'dist/reveal-compiler-explorer.cjs',
      format: 'cjs',
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
      exports: 'default'
    }
  ],
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    nodePolyfills({
      include: 'process'
    }),
    del({ targets: 'dist/*' })
  ]
};
