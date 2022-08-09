/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const { merge } = require('webpack-merge')
const { createDefaultConfig } = require('@open-wc/building-webpack')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(
  createDefaultConfig({
    input: path.resolve(__dirname, './src/index.html'),
    output: {
      publicPath: '/app/',
    },
  }),
  {
    resolve: {
      extensions: ['.ts', '.mjs', '.js', '.json'],
      alias: {
        stream: 'readable-stream',
      },
    },
    module: {
      rules: [{
        test: /\.(ttl|nt|nq|rdf|jsonld|trig)$/,
        use: 'webpack-loader-rdf',
      },
      {
        test: /\.css$/i,
        use: ['raw-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['raw-loader', 'sass-loader'],
      }],
    },
    node: {
      crypto: true,
    },
    devServer: {
      contentBase: '/app/',
    },
    plugins: [
      new Dotenv({
        path: '../../.env',
        systemvars: true,
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: '../../node_modules/@shoelace-style/shoelace/dist/assets', to: 'assets' },
          { from: 'src/images', to: 'images' },
          { from: 'src/vendor', to: 'vendor' },
          { from: 'src/css', to: 'css' },
          'src/functions.js',
        ],
      }),
    ],
  },
)
