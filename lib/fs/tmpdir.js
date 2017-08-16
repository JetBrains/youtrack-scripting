module.exports = function(filePath) {
  return require('path').resolve('/tmp/', filePath);
};
