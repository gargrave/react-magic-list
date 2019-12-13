const path = require('path')

const pkg = require('./package.json')

module.exports = {
  components: ['src/components/List/List.tsx'],
  propsParser: require('react-docgen-typescript').withCustomConfig(
    './tsconfig.json',
    [{}],
  ).parse,
  styleguideDir: 'docs',
  title: `React Magic List ${pkg.version}`,
  webpackConfig: require('./webpack.config.js'),
}
