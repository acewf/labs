// Rollup plugins
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default{
  entry:'src/index.js',
  dest:'public/js/app.js',
  format:'umd',
  sourceMap:'default',
  plugins: [
  resolve({
      browser: true,
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}
