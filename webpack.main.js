const merge = require('webpack-merge');
const common = require('./config/webpack.common');
var nodeExternals = require('webpack-node-externals');


module.exports = {
  entry: {
    main: './electron/main.js'
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  target: "electron-main"
};

module.exports = merge(common, module.exports);
