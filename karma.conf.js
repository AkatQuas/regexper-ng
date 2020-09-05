const webpackConfig = require('./webpack.config.js');

module.exports = function(karma) {
  karma.set({
    frameworks: ['jasmine'],
    files: [ 'spec/test_index.js' ],
    preprocessors: {
      'spec/test_index.js': ['webpack', 'sourcemap']
    },
    reporters: ['progress', 'notify'],
    colors: true,
    logLevel: karma.LOG_INFO,
    browsers: ['Chrome'],
    autoWatch: true,
    singleRun: false,
    webpack: {
      devtool: 'inline-source-map',
      mode: 'development',
      module: webpackConfig.module
    }
  });
};
