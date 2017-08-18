const resolve = require('url').resolve;
const path = require('path');
const exit = require('../lib/cli/exit');
const fileupload = require('../lib/net/fileupload');
const zipfolder = require('../lib/fs/zipfolder');
const tmpdir = require('../lib/fs/tmpdir');
const HttpMessage = require('../lib/net/httpmessage');

module.exports = function(config, workflowDir) {
  var zipPath = tmpdir(generateZipName(workflowDir));

  zipfolder(path.resolve(config.cwd, workflowDir), zipPath, (error, zip) => {
    if (error) return exit(error);

    return fileupload(HttpMessage.sign(resolve(config.host, '/api/admin/workflows/import'), config.token), zip.path, (error) => {
      if (error) return exit(error);
    });
  });

  function generateZipName(workflowDir) {
    return 'youtrack-workflow-' + path.basename(workflowDir) + '.zip';
  }
};
