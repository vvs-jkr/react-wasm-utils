/* eslint-env node */
/* eslint-disable no-undef */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    entry: './src/main.tsx',
    output: {
      filename: isProduction ? '[name].[contenthash].js' : 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: '/',
    },
    resolve: {
      alias: {
        'react-wasm-utils': path.resolve(__dirname, '../react-wasm-utils/dist'),
        '~': path.resolve(__dirname, 'src'),
        '~/shared': path.resolve(__dirname, 'src/shared'),
        '~/entities': path.resolve(__dirname, 'src/entities'),
        '~/features': path.resolve(__dirname, 'src/features'),
        '~/widgets': path.resolve(__dirname, 'src/widgets'),
        '~/pages': path.resolve(__dirname, 'src/pages'),
        '~/app': path.resolve(__dirname, 'src/app'),
      },
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.wasm$/,
          type: 'webassembly/async',
        },
        {
          test: /\.module\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /worker\.ts$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript'],
            },
          },
        },
        {
          test: /test-worker\.js$/,
          use: 'babel-loader',
        },
      ],
    },
    experiments: {
      asyncWebAssembly: true,
      topLevelAwait: true,
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      port: 3003,
      hot: true,
      liveReload: true,
      allowedHosts: 'all',
      historyApiFallback: true,
      headers: {
        'Cross-Origin-Embedder-Policy': 'credentialless',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
      setupMiddlewares: (middlewares, devServer) => {
        // WASM MIME type
        devServer.app.get('*.wasm', (req, res, next) => {
          res.setHeader('Content-Type', 'application/wasm')
          next()
        })

        // Worker MIME type
        devServer.app.get('*.js', (req, res, next) => {
          if (req.url.includes('worker')) {
            res.setHeader('Content-Type', 'application/javascript')
          }
          next()
        })

        return middlewares
      },
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        inject: 'body',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public/favicon.ico'),
            to: '',
            noErrorOnMissing: true,
          },
          {
            from: '../react-wasm-utils/wasm-lib/pkg/wasm_lib_bg.wasm',
            to: 'wasm/',
            noErrorOnMissing: true,
          },
          {
            from: '../react-wasm-utils/wasm-lib/pkg/wasm_lib.js',
            to: 'wasm/',
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
  }
}
