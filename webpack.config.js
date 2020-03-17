const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  plugins:
  [
    new MiniCssExtractPlugin()
  ],
  module:
  {
    rules:
    [
      {
        test:/\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test:/\.styl$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader']
      }
    ]
  }
};