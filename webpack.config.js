const path = require('path');

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
    
    ]

  }

};