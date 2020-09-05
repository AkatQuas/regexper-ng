const styles = require('!!css-loader!sass-loader!../../src/sass/svg.scss');

module.exports = function() {
  return styles.default.toString();
};
