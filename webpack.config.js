const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'src')
const PUBLIC_DIR = path.resolve(__dirname, 'public')

module.exports = {
  entry: path.resolve(SRC_DIR, 'index.js'),
  mode: process.env.NODE_ENV,
  output: {
    path: path.resolve(PUBLIC_DIR, 'scripts'),
    publicPath: '/scripts/',
    filename: 'index.js'
  },
  devServer: {
    port: 8000,
    contentBase: PUBLIC_DIR,
    historyApiFallback: true,
    proxy: {
      '/.netlify': {
        target: 'http://localhost:9000',
        pathRewrite: { '^/.netlify/functions': '' }
      }
    }
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', 
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
          'sass-loader'
        ],
      }
    ],
  },
  resolve: {
    modules: [SRC_DIR, 'node_modules']
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
}
