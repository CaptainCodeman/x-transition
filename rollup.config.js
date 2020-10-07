import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import summary from 'rollup-plugin-summary'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/transition.ts',
  output: {
    file: 'public/transition.js',
    format: 'esm',
    sourcemap: 'hidden',
  },
  plugins: [
    typescript(),
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