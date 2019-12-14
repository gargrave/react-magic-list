const path = require('path')

const pkg = require('./package.json')

module.exports = {
  components: ['src/components/List/List.tsx'],
  exampleMode: 'hide',
  propsParser: require('react-docgen-typescript').withCustomConfig(
    './tsconfig.json',
    [{}],
  ).parse,
  require: [path.join(__dirname, 'src/styleguide/Styleguide.scss')],
  styleguideDir: 'docs',
  title: `React Magic List ${pkg.version}`,
  webpackConfig: require('./webpack.config.js'),
}
