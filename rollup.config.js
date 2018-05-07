import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

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
    uglify(),
  ],
};
