const merge = require('webpack-merge');
const common = require('./config/webpack.common');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");


module.exports = {
  entry: {
    renderer: path.join(__dirname, "src/index.js")
  },
  output: {
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ],
};

module.exports = merge(common, module.exports);
