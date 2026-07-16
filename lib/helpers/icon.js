const handlebars = require('handlebars/runtime');
const { icon } = require('../icons');

module.exports = function (name) {
  return new handlebars.SafeString(icon(name));
};
