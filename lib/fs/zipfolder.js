const fs = require('fs');
const archiver = require('archiver');

/**
 * @param {string} srcFolder
 * @param {string} zipFilePath
 * @param {(error: Error | null, data?: *) => void} callback
 * @returns
 */
function zipFolder(srcFolder, zipFilePath, callback) {
  const output = fs.createWriteStream(zipFilePath);
  const zipArchive = archiver('zip');

  output.on('close', () => {
    callback(null, output);
  });

  zipArchive.on('error', (error) => {
    callback(error);
  });

  zipArchive.pipe(output);
  zipArchive.glob('**/*.*', { cwd: srcFolder });
  zipArchive.finalize();
  return zipArchive;
}

module.exports = zipFolder;
