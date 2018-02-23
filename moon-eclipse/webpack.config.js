const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin({ filename: 'styles.css', disable: false, allChunks: true });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const venture = process.env.VENTURE;

const sourcePath = path.join(__dirname, './src');
const outputPath = path.join(__dirname, 'output');

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
    }
  })
];

const ejsConfig = {
  template: `${sourcePath}/index.ejs`,
  production: isProd,
  inject: true,
}
if (isProd) {
  ejsConfig.filename = 'index.html';
}

plugins.push(
  new HtmlWebpackPlugin(ejsConfig)
);

if (isProd) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      },
      output: {
        comments: false
      },
    })
  );
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );
}

module.exports = {
  devtool: isProd ? 'hidden-source-map' : 'source-map',
  entry: {
    bundle: hotInject('./src')
  },
  output: {
    path: outputPath,
    filename: '[name].js',
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ],
    rules: [
      {
        test: /\.(png|eot|woff|woff2|ttf|svg|gif)(\?v=\d+\.\d+\.\d+)?$/,
        use: { loader: "url-loader", options: { limit: 10000 } },
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: 'raw-loader'
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      {
        test: /\.html$/,
        use: {
          loader: 'file-loader',
          query: {
            name: '[name].[ext]'
          }
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              cacheDirectory: true
            }
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      sourcePath,
      'node_modules'
    ]
  },
  plugins: plugins,
  devServer: {
    contentBase: path.resolve(__dirname, 'publicDev'),
    publicPath: '/',
    inline: true,
    port: 5001,
    host:'0.0.0.0',
    hot: true,
    compress: isProd,
    stats: { colors: true }
  }
};

function hotInject(path) {
  return isProd ? [path] : [
    'webpack-dev-server/client?http://localhost:5001',
    'webpack/hot/only-dev-server',
    path
  ]
}
