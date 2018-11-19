const path = require('path');
const homedir = require('os').homedir();

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
  let clientId;

  if (env && env.clientId) {
    clientId = env.clientId;
  } else {
    const userProperties = require(homedir + '/.md-oidc.dev');

    clientId = userProperties.clientId;
  }

  return {
    devtool: 'eval-cheap-module-source-map',
    entry: './src/index.js',
    devServer: {
      port: 7890,
      public: 'md.freenet.local:7890',
      https: true,
      contentBase: path.join(__dirname, 'dist')
    },
    node: {
      fs: 'empty'
    },
    resolve: {
      symlinks: false
    },
    module: {
      rules: [
        {
          test: /(\.jsx|\.js)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        },
        {
          test: /\.(scss|css)$/,
          use: [
            {
              // creates style nodes from JS strings
              loader: 'style-loader',
              options: {
                sourceMap: true
              }
            },
            {
              // translates CSS into CommonJS
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              // compiles Sass to CSS
              loader: 'sass-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: true,
                sourceMapContents: true
              }
            }
            // Please note we are not running postcss here
          ]
        },
        {
          // Load all images as base64 encoding if they are smaller than 8192 bytes
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                // On development we want to see where the file is coming from, hence we preserve the [path]
                name: '[path][name].[ext]?hash=[hash:20]',
                limit: 8192
              }
            }
          ]
        },
        {
          test: /\.(json)$/,
          use: [
            {
              loader: 'string-replace-loader',
              options: {
                search: '${client_id}',
                replace: clientId
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: true,
        chunks: ['main']
      }),
      new HtmlWebpackPlugin({
        filename: 'frame-callback.html',
        template: './frame-callback.html',
        chunks: ['frameCallback'],
        inject: false
      })
    ],
    externals: {
      jquery: 'jQuery'
    }
  };
};
