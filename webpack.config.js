const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const distUrl =
  typeof process.env.DIST_URL === 'string' ? process.env.DIST_URL : '';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : 'source-map',
  entry: './src/js/main.js',
  output: {
    path: path.join(__dirname, './build'),
    filename: '[name]-[contenthash].js',
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'static'),
    },
    port: 8080,
    hot: true,
    open: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: './static' }],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.handlebars',
      title: false,
      distUrl,
      date: new Date().toISOString(),
    }),
    new HtmlWebpackPlugin({
      template: './src/changelog.handlebars',
      filename: 'changelog.html',
      title: 'Changelog',
      distUrl,
      date: new Date().toISOString(),
      changelog: require('./changelog.json'),
    }),
    new HtmlWebpackPlugin({
      template: './src/documentation.handlebars',
      filename: 'documentation.html',
      title: 'Documentation',
      distUrl,
      date: new Date().toISOString(),
    }),
    new HtmlWebpackPlugin({
      template: './src/404.handlebars',
      filename: '404.html',
      title: 'Page Not Found',
      distUrl,
      date: new Date().toISOString(),
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: require.resolve('snapsvg'),
        use: {
          loader: 'imports-loader',
          options: {
            wrapper: 'window',
            additionalCode: 'module.exports = 0;',
          },
        },
      },
      {
        test: /\.peg$/,
        use: require.resolve('./lib/canopy-loader'),
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader',
        options: {
          partialDirs: [path.resolve(__dirname, 'lib/partials')],
          helperDirs: [path.resolve(__dirname, 'lib/helpers')],
          precompileOptions: {
            knownHelpersOnly: false,
          },
        },
      },
    ],
  },
};
