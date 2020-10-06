import { terser } from 'rollup-plugin-terser'
import summary from 'rollup-plugin-summary'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/transition.js',
  output: {
    file: 'public/transition.js',
    format: 'esm',
    sourcemap: 'hidden',
  },
  plugins: [
    production && terser({
      mangle: {
        properties: {
          regex: /_$/,
        }
      },
    }),
    production && summary(),
  ],
}