import { terser } from 'rollup-plugin-terser';
import { DEFAULT_FN_NAME, DIST_MIN_FILE } from './const';

export default {
  input: './src/index.js',
  plugins: [
    terser(),
  ],
  output: {
    file: `./dist/${DIST_MIN_FILE}`,
    format: 'umd',
    name: DEFAULT_FN_NAME,
  }
}