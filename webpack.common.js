const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

module.exports = {
  entry: {
    main: './src/js/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'build', 'js'),
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          'html-loader',
          {
            loader: 'posthtml-loader',
            options: {
              plugins() {
                const isSpriteExist = fs.existsSync(
                  path.resolve(__dirname, 'build', 'img', 'sprite.svg'),
                );
                let pluginsList = [];

                if (isSpriteExist) {
                  // eslint-disable-next-line global-require
                  pluginsList = [...pluginsList, require('posthtml-include')()];
                }

                return pluginsList;
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: 'src/html/index.html',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
