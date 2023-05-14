// const path = require('path');
// const nodeExternals = require('webpack-node-externals');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  //   entry: ['./src/index.ts'],
  //   target: 'node',
//   externals: [nodeExternals()],
  //   output: {
  //     path: path.resolve(__dirname, 'lib'),
  //     filename: 'index.js',
  //     libraryTarget: 'commonjs-module'
  //   },
  module: {
    rules: [
    //   {
    //     test: /\.tsx?$/,
    //     use: 'ts-loader',
    //     exclude: /node_modules/,
    //   },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          optimizeSSR: false,
        },
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
    //   {
    //     test: /\.js$/,
    //     loader: 'babel-loader',
    //   },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
    //   {
    //     test: /\.css$/,
    //     use: ['style-loader', 'css-loader', 'postcss-loader'],
    //   },
    //   {
    //     test: /\.scss$/,
    //     use: ['style-loader', 'css-loader', 'sass-loader'],
    //   },
    ],
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
  ],
  //   resolve: {
  //     alias: {
  //       vue$: 'vue/dist/vue.esm.js',
  //     },
  //   },
  //   devtool: 'source-map',
};
