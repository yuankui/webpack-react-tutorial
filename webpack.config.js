const merge = require('webpack-merge');
const common = require('./config/webpack.common');
const path = require('path');


module.exports = {
  output: {
  }
};

module.exports = merge(common, module.exports);
