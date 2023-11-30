import webpack from 'webpack';
import config from './webpack.config';
const ESLintPlugin = require('eslint-webpack-plugin');

(config.module as any).rules.push({
  test: /\.(ts|tsx)$/,
  exclude: /node-modules/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        cacheCompression: false,
      },
    },
  ],
});

(config.plugins as any).push(new webpack.HotModuleReplacementPlugin());
(config.plugins as any).push(
  new ESLintPlugin({
    extensions: ['ts', 'tsx'],
    exclude: '/node_modules/',
    outputReport: true,
  })
);

config.entry = ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/app.tsx'];

export default { ...config };
