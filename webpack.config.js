const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./config');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: config.buildRoot
  },
  entry: './src/js/main.js',
  output: {
    path: config.buildRoot,
    filename: '[name]-[hash].js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: './static' }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/index.handlebars',
      title: false,
      date: new Date().toISOString()
    }),
    new HtmlWebpackPlugin({
      template: './src/changelog.handlebars',
      filename: 'changelog.html',
      title: 'Changelog',
      date: new Date().toISOString(),
      changelog: require('./changelog.json')
    }),
    new HtmlWebpackPlugin({
      template: './src/documentation.handlebars',
      filename: 'documentation.html',
      title: 'Documentation',
      date: new Date().toISOString()
    }),
    new HtmlWebpackPlugin({
      template: './src/404.handlebars',
      filename: '404.html',
      title: 'Page Not Found',
      date: new Date().toISOString()
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: require.resolve('snapsvg'),
        loader: 'imports-loader',
        options: {
          wrapper: 'window',
          additionalCode: 'module.exports = 0;'
        }
      },
      {
        test: /\.peg$/,
        loader: require.resolve('./lib/canopy-loader')
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader',
        options: {
          partialDirs: [path.resolve(__dirname, 'lib/partials')],
          helperDirs: [path.resolve(__dirname, 'lib/helpers')],
          precompileOptions: {
            knownHelpersOnly: false
          }
        }
      }
    ]
  }
};
