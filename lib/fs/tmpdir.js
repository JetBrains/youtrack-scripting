const os = require('os');

module.exports = function(filePath) {
  return require('path').resolve(os.tmpdir(), filePath);
};
