const production = process.env.NODE_ENV === 'production'

module.exports = {
  plugins: [
    require('tailwindcss'),
    production && require('autoprefixer'),
    production && require('cssnano')({
      preset: 'default',
    }),
  ]
}