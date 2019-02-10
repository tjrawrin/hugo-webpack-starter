const path = require('path');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = (env, argv) => {
  const devMode = argv.mode != 'production';

  return {
    mode: argv.mode,
    devtool: devMode ? 'cheap-eval-source-map' : 'source-map',
    entry: {
      main: ['./assets/js/main.js', './assets/scss/main.scss'],
      images: './assets/images/index.js',
    },
    output: {
      filename: devMode ? 'js/[name].js' : 'js/[name].[chunkhash:8].js',
      publicPath: '/',
      path: path.resolve(__dirname, 'static'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'assets'),
          use: 'babel-loader',
        },
        {
          test: /\.s?css$/,
          include: path.resolve(__dirname, 'assets'),
          use: [
            { loader: MiniCssExtractPlugin.loader },
            {
              loader: 'css-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'resolve-url-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true }
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          include: path.resolve(__dirname, 'assets'),
          use: {
            loader: 'url-loader',
            options: {
              limit: 15000,
              name: devMode ? 'images/[name].[ext]' : 'images/[name].[hash:8].[ext]',
            }
          },
        },
      ],
    },
    plugins: [
      new FixStyleOnlyEntriesPlugin(),
      new MiniCssExtractPlugin({
        filename: devMode ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
        chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[contenthash:8].css',
      }),
      new ManifestPlugin({
        publicPath: '/',
        fileName: path.resolve(__dirname, 'data/manifest.json'),
      })
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true,
            },
          },
        }),
        new UglifyWebpackPlugin({ sourceMap: true })
      ],
    },
  }
}
