var fs = require('fs');
var archiver = require('archiver');

/**
 * @param {string} srcFolder 
 * @param {string} zipFilePath 
 * @param {(error: Error | null, data?: *) => void} callback 
 * @returns 
 */
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
  zipArchive.glob('*.js', { cwd: srcFolder });
  zipArchive.glob('package.json', { cwd: srcFolder });
  zipArchive.glob('README.md', { cwd: srcFolder });
  zipArchive.finalize();
  return zipArchive;
}

module.exports = zipFolder;
