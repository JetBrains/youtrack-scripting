var fs = require('fs');
var path = require('path');
var archiver = require('archiver');

function zipFolder(srcFolder, zipFilePath, callback) {
  var output = fs.createWriteStream(zipFilePath);
  var zipArchive = archiver('zip');

  output.on('close', () => {
    callback(null, output);
  });

  zipArchive.on('error', (error) => {
    callback(error);
  });

  zipArchive.pipe(output);
  zipArchive.glob(path.resolve(srcFolder, '*.js'));
  zipArchive.glob(path.resolve(srcFolder, 'package.json'));
  zipArchive.glob(path.resolve(srcFolder, 'README.md'));
  zipArchive.finalize();
  return zipArchive;
}

module.exports = zipFolder;
