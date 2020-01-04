const path = require('path')

const pkg = require('./package.json')

const ROOT = 'src/components/List/styleguide'

module.exports = {
  components: [`${ROOT}/ListStyleguide.tsx`],
  exampleMode: 'hide',
  propsParser: require('react-docgen-typescript').withCustomConfig(
    './tsconfig.json',
    [{}],
  ).parse,
  require: [path.join(__dirname, `${ROOT}/Styleguide.scss`)],
  styleguideDir: 'docs',
  title: `React Magic List ${pkg.version}`,
  webpackConfig: require('./webpack.config.js'),
}
