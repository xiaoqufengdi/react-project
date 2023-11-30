import { resolve } from 'path';
import { Configuration, DefinePlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
const devMode = process.env.NODE_ENV !== 'production';

export default {
  mode: 'development',
  entry: ['./src/app.tsx'],
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@src': resolve('./src'),
      '@utils': resolve('./src/utils'),
      '@components': resolve('./src/components'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template/dev.html',
      publicPath: '/',
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[contenthash].css',
    }),
  ],
  output: {
    filename: 'js/[name].bundle.js',
    path: resolve('.', 'build'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/i,
        exclude: /node-modules/,
        use: [
          devMode
            ? {
                loader: 'style-loader',
              }
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../',
                },
              },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              url: (url) => !url.startsWith('/'),
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name() {
                if (devMode) {
                  return 'img/[path][name].[ext]';
                }
                return 'img/[contenthash].[ext]';
              },
              limit: false,
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  externals: {
    react: 'React',
    _: 'lodash',
  },
} as Configuration;
