var resolve = require('url').resolve;
var path = require('path');
var net = require('../lib/net/index');
var zipfolder = require('../lib/fs/zipfolder');
var tmpdir = require('../lib/fs/tmpdir');

var request = net.request;
var sign = net.sign;

module.exports = function(config, workflowDir, params) {
  params = params || {};
  params.output = path.resolve(config.cwd, params.output || tmpdir(generateZipName(workflowDir)));

  zipfolder(path.resolve(config.cwd, workflowDir), params.output, (error, zip) => {
    if (error) throw error;

    var options = sign(resolve(config.host, '/api/admin/workflows/import'), config.token);
    options.method = 'POST';

    var req = request(options, (error) => {
      if (error) throw error;
    });

    return req;
  })

  function generateZipName(workflowDir) {
    return 'youtrack-workflow-' + path.basename(workflowDir) + '-' + Date.now() + '.zip';
  }
};
