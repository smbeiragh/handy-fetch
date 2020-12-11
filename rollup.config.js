import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'build/handy_fetch.js', format: 'umd', exports: 'named', name: 'handyFetch', sourcemap: 'file',
    },
    {
      file: 'build/handy_fetch.cjs.js', format: 'cjs', exports: 'named', sourcemap: 'file',
    },
    { file: 'build/handy_fetch.es.js', format: 'es', exports: 'named', sourcemap: 'file' },
  ],
  plugins: [
    commonjs(),
    resolve({
      extensions: [".js", ".ts"]
    }),
    babel({
      babelHelpers: "runtime",
      extensions: [".js",".ts"]
    }),
    terser(),
  ],
};
