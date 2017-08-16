var fs = require('fs');
var archiver = require('archiver');

function zipFolder(srcFolder, zipFilePath, callback) {
  var output = fs.createWriteStream(zipFilePath);
  var zipArchive = archiver('zip');

  output.on('close', () => {
    callback(null, output);
  });

  zipArchive.on('error', (error) => {
    callback(error)
  });

  zipArchive.pipe(output);
  zipArchive.directory(srcFolder, false);
  zipArchive.finalize();
  return zipArchive;
}

module.exports = zipFolder;
