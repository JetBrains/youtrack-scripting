const fs = require('fs');
const path = require('path');
const unzip = require('unzipper');

/**
 * @param {string} zipFilePath
 * @param {string} outputdir
 * @param {(error: Error|null) => void} [fn]
 * @returns {void}
 */
module.exports = function(zipFilePath, outputdir, fn) {
  if (!fs.existsSync(zipFilePath)) {
    const error = new Error(`File "${zipFilePath}" not found`);
    if (fn) return fn(error);
    throw error;
  }

  const outputPath = outputdir || path.dirname(zipFilePath);

  fs.createReadStream(zipFilePath)
    .pipe(unzip.Extract({
      path: outputPath
    }))
    .on('error', (error) => fn && fn(error))
    .on('close', function() {
      fn && fn(null);
    });
};
