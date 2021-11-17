const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: 'production',
  devtool: false,
  entry: './src/js/main.js',
  output: {
    path: path.join(__dirname, 'extensions', 'media'),
  },
  plugins: [new CleanWebpackPlugin(), new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: require.resolve('snapsvg'),
        loader: 'imports-loader',
        options: {
          wrapper: 'window',
          additionalCode: 'module.exports = 0;',
        },
      },
      {
        test: /\.peg$/,
        loader: require.resolve('./lib/canopy-loader'),
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
};
module.exports = config;
