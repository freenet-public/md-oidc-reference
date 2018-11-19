const path = require('path');
const homedir = require('os').homedir();

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');

module.exports = env => {
  let clientId;

  if (env && env.clientId) {
    clientId = env.clientId;
  } else {
    const userProperties = require(homedir + '/.md-oidc.prod');

    clientId = userProperties.clientId;
  }

  return {
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
      filename: '[name].[hash:20].js',
      path: buildPath
    },
    node: {
      fs: 'empty'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',

          options: {
            presets: ['env']
          }
        },
        {
          test: /\.(scss|css|sass)$/,
          use: ExtractTextPlugin.extract({
            use: [
              {
                // translates CSS into CommonJS
                loader: 'css-loader',
                options: {
                  sourceMap: true
                }
              },
              {
                // Runs compiled CSS through postcss for vendor prefixing
                loader: 'postcss-loader',
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
            ],
            fallback: 'style-loader'
          })
        },
        {
          // Load all images as base64 encoding if they are smaller than 8192 bytes
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: '[name].[hash:20].[ext]',
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
        // Inject the js bundle at the end of the body of the given template
        inject: 'body',
        chunks: ['main']
      }),
      new HtmlWebpackPlugin({
        filename: 'frame-callback.html',
        template: './frame-callback.html',
        chunks: ['frameCallback'],
        inject: false
      }),
      new CleanWebpackPlugin(buildPath),
      new FaviconsWebpackPlugin({
        // Your source logo
        logo: './src/assets/icon.png',
        // The prefix for all image files (might be a folder or a name)
        prefix: 'icons-[hash]/',
        // Generate a cache file with control hashes and
        // don't rebuild the favicons until those hashes change
        persistentCache: true,
        // Inject the html into the html-webpack-plugin
        inject: true,
        // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
        background: '#fff',
        // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
        title: 'md-oidc-html}}',

        // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          opengraph: false,
          twitter: false,
          yandex: false,
          windows: false
        }
      }),
      new ExtractTextPlugin('styles.[md5:contenthash:hex:20].css', {
        allChunks: true
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          map: {
            inline: false
          },
          discardComments: {
            removeAll: true
          }
        },
        canPrint: true
      })
    ],
    externals: {
      jquery: 'jQuery'
    }
  };
};
