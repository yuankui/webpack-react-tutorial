const merge = require('webpack-merge');
const common = require('./config/webpack.common');
const nodeExternals = require('webpack-node-externals');


module.exports = {
  optimization: {
    minimize: false
  },
  entry: {
    main: './electron/main.js'
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  target: "electron-main"
};

module.exports = merge(common, module.exports);
