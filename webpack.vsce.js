const path = require('path');
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
    clean: true,
  },
  plugins: [new MiniCssExtractPlugin()],
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
    ],
  },
};
module.exports = config;
