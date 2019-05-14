import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'build/handy_fetch.js', format: 'umd', exports: 'named', name: 'handyFetch',
    },
    { file: 'build/handy_fetch.es.js', format: 'es', exports: 'named' },
  ],

  plugins: [
    babel({
      runtimeHelpers: true,
    }),
    terser(),
  ],
};
