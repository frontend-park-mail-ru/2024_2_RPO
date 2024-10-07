/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/App.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader' }],
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'inline-source-map',
  devServer: {
    static: [path.resolve(__dirname), path.resolve(__dirname, 'src')],
    liveReload: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
      }),
    ],
  },
  optimization: {
    runtimeChunk: 'single',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
};
console.log(module.exports);
