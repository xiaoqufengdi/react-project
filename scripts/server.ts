import express from 'express';
const bodyParser = require('body-parser');

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.server';
import terminalUrlPrint from 'terminal-url-print';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

webpackConfig.optimization = {
  runtimeChunk: 'single',
};

const compiler = webpack(webpackConfig);
const port = '9111';

app.use(express.static('public')); // static

// 接口代理
app.use(
  createProxyMiddleware('/proxyApi/', {
    target: 'http://192.168.0.2:9090/',
    pathRewrite: {
      '^/proxyApi/': '/', // rewrite path
    },
    changeOrigin: true,
  })
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.all('*', (req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  next();
});

// Rewrite the url to the page url of index.html
app.get('*', (req: any, res: unknown, next: any) => {
  if (req.url !== '/__webpack_hmr' && req.url.indexOf('.') === -1) {
    req.url = '/';
  }
  next();
});

// Tell express to use the webpack-dev-middleware and use the webpack.config.js configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: (webpackConfig.output as any).publicPath,
  })
);

app.use(webpackHotMiddleware(compiler as never));

app.listen(port, () => {
  terminalUrlPrint({ port, copyType: 'localhost' });
});
