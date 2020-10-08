const production = process.env.NODE_ENV === 'production'
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: production,
    mode: 'all',
    preserveHtmlElements: false,
    content: [
      'public/*.html',
    ],
    options: {
      whitelist: ['pre', 'code'],
    },
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/ui'),
  ],
}
