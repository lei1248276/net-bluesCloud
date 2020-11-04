const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssTextPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/main.js",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "js/[name].js",
    chunkFilename: "js/[name].js",
    publicPath: "/dist/"
  },
  resolve: {
    extensions: ['.js', '.vue', '.css', '.scss'],
    modules: [
        path.resolve(__dirname, "src"),
        path.resolve(__dirname, "node_modules"),
        "node_modules"
    ],
    alias: {
      "img": path.resolve(__dirname, '../src/assets/img'),
      "@": path.resolve(__dirname, 'src'),
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/g,
        use: [
            'vue-style-loader',
            MiniCssTextPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          },
            "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require('node-sass'),
              sourceMap: true
            }
          }
        ],
        exclude: /node_modules/,
      },

      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [['@babel/preset-env', {modules: false}]],
          }
        },
        exclude: /node_modules/,
      },

      {
        test: /\.html$/,
        use: "html-loader",
      },

      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: "url-loader",
          options: {
            name: "img/[name].[ext]",
            limit: 10240,
            esModule: false
          }
        },
      },

      {
        test: /\.vue$/,
        use: "vue-loader"
      }
    ]
  },
  plugins: [
      new VueLoaderPlugin(),
      new MiniCssTextPlugin({
        filename: "css/[name].css",
        chunkFilename: "css/[id].css",
        ignoreOrder: true,
      }),
      /*new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "Net-Blues cloud",
        favicon: "./public/favicon.jpg",
      }),*/
    /*new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }),*/
      // new BundleAnalyzerPlugin(),
      // new CleanWebpackPlugin()
  ],
  devServer: {
    // publicPath: '/dist/',
    // contentBase: path.join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
    open: 'http://localhost:8080'
  }
}