const path = require('path')
const webpack = require('webpack')
const DotEnvPlugin = require('dotenv-webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UnusedFilesWebpackPlugin = require("unused-files-webpack-plugin").default
const HtmlWebpackPlugin = require('html-webpack-plugin')

const SRC_DIR = path.resolve(__dirname, 'src')
const ROOT_DIR = path.resolve(__dirname)
const PUBLIC_DIR = path.resolve(__dirname, 'public')

module.exports = [
  {
    entry: path.resolve(SRC_DIR, 'index.js'),
    mode: process.env.NODE_ENV === 'production'
      ? 'production' : 'development',
    output: {
      path: path.resolve(PUBLIC_DIR, 'dist'),
      publicPath: '/',
      filename: 'scripts/index.[contenthash].js'
    },
    devServer: {
      port: 8000,
      contentBase: [
        PUBLIC_DIR,
        path.resolve(PUBLIC_DIR, 'dist')
      ],
      historyApiFallback: {
        rewrites: [
          { from: /^\/$/, to: '/index.html' },
          { from: /^\/.*/, to: '/app.html' }
        ]
      },
      proxy: {
        '/api/*': {
          target: 'http://localhost:7999/',
          secure: false
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
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
        }
      ],
    },
    resolve: {
      modules: [SRC_DIR, ROOT_DIR, 'node_modules']
    },
    optimization: {
      usedExports: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'app.html',
        template: 'src/html/app.html'
      }),

      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/html/index.html',
        inject: false
      }),

      new HtmlWebpackPlugin({
        filename: 'terms-of-service.html',
        template: 'src/html/terms-of-service.html',
        inject: false
      }),

      new UnusedFilesWebpackPlugin({
        patterns: ['src/**/*.js']
      }),
      new DotEnvPlugin(),
      new webpack.EnvironmentPlugin({
        STRIPE_PUBLISHABLE_KEY: JSON.stringify(process.env.STRIPE_PUBLISHABLE_KEY) || '',
        TZ: JSON.stringify(process.env.TZ) || '',
        FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY) || '',
        FIREBASE_PROJECT_ID: JSON.stringify(process.env.FIREBASE_PROJECT_ID) || '',
        FIREBASE_APP_ID: JSON.stringify(process.env.FIREBASE_APP_ID) || '',
        NODE_ENV: JSON.stringify(process.env.NODE_ENV) || '',
      }),
    ],
  }
]
