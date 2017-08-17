const fs = require('fs');
const path = require('path');

module.exports = function(outputPath, fileName) {
  if (!fileName || !fs.existsSync(fileName)) {
    throw new Error('File path should reference an existing file')
  }
  const context = outputPath ? outputPath : process.cwd();
  return path.resolve(context, fileName);
};
