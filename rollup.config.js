import { terser } from 'rollup-plugin-terser'
import summary from 'rollup-plugin-summary'

export default {
  input: 'src/transition.js',
  output: {
    file: 'public/transition.js',
    format: 'esm',
    sourcemap: 'hidden',
  },
  plugins: [
    terser({
      mangle: {
        properties: {
          regex: /_$/,
        }
      },
    }),
    summary(),
  ],
}