const fs = require('fs');
const path = require('path');
const unzip = require('unzipper');

module.exports = function(zipFilePath, outputdir, fn) {
  if (!fs.existsSync(zipFilePath)) {
    var error = new Error(`File "${zipFilePath}" not found`);
    if (fn) return fn(error);
    throw error;
  }

  const outputPath = outputdir || path.dirname(zipFilePath);

  return fs.createReadStream(zipFilePath)
    .pipe(unzip.Extract({
      path: outputPath
    }))
    .on('close', function() {
      fn && fn(null);
    });
};
