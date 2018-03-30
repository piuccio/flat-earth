import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'index.js',
  output: [
    { format: 'cjs', file: 'build/bundle.cjs.js' },
    { format: 'umd', file: 'build/bundle.umd.js', name: 'flat-earth' },
    { format: 'es', file: 'build/bundle.es.js' },
  ],
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
  ],
};
