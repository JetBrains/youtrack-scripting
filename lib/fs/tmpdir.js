const os = require('os');

/**
 * @param {string} filePath
 * @returns {string}
 */
module.exports = function(filePath) {
  return require('path').resolve(os.tmpdir(), filePath);
};
