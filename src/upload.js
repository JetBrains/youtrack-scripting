var resolve = require('url').resolve;
var path = require('path');
var sign = require('../lib/net/index').sign;
var fileupload = require('../lib/net/fileupload');
var zipfolder = require('../lib/fs/zipfolder');
var tmpdir = require('../lib/fs/tmpdir');

module.exports = function(config, workflowDir) {
  var zipPath = tmpdir(generateZipName(workflowDir));

  zipfolder(path.resolve(config.cwd, workflowDir), zipPath, (error, zip) => {
    if (error) throw error;

    return fileupload(sign(resolve(config.host, '/api/admin/workflows/import'), config.token), zip.path, (error) => {
      if (error) throw error;
    });
  });

  function generateZipName(workflowDir) {
    return 'youtrack-workflow-' + path.basename(workflowDir) + '.zip';
  }
};
