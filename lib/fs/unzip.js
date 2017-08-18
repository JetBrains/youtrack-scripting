const fs = require('fs');
const path = require('path');
const unzip = require('unzip');

module.exports = function(zipFilePath, outputdir) {
  if (!fs.existsSync(zipFilePath)) {
    console.error(`File "${zipFilePath}" not found`);
    return;
  }

  const outputPath = outputdir || path.dirname(zipFilePath);

  return fs.createReadStream(zipFilePath)
    .pipe(unzip.Extract({
      path: outputPath
    }))
    .on('close', function() {
      console.log(`File extracted into '${outputPath}'`);
    });
};
