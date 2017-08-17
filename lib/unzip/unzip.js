const fs = require('fs');
const path = require('path');
const unzip = require('unzip');

module.exports = function (config, zipFilePath) {
  if (!fs.existsSync(zipFilePath)) {
    console.error(`File "${zipFilePath}" not found`);
    return;
  }

  const outputPath = config.output || path.resolve(process.cwd(), path.parse(zipFilePath).name);

  return fs.createReadStream(zipFilePath)
    .pipe(unzip.Extract({path: outputPath}))
    .on('close', function() {
      console.log(`File extracted into '${outputPath}'`);
    });
};