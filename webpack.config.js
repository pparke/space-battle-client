const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  target: 'web',

  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['latest'] }
        }]
      }
    ]
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '/dist'),
    publicPath: '/'
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]

};
