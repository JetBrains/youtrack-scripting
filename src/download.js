var fs = require('fs');
var resolve = require('url').resolve;
var net = require('../lib/net/index');
var tmpdir = require('../lib/fs/tmpdir');

var request = net.request;
var sign = net.sign;

module.exports = function(config, workflowName) {
  if (!workflowName) throw new Error('Workflow name should be defined');

  var req = request(sign(resolve(config.host, '/rest/workflow/distributive/' + workflowName), config.token),
    (error) => {
      if (error) throw error;
    }
  );

  req.on('response', (res) => {
    var zip = fs.createWriteStream(tmpdir(getZipName(workflowName)));
    res.pipe(zip);
  });

  return req;

  function getZipName(workflowName) {
    return 'youtrack-workflow-' + workflowName + '-' + Date.now() + '.zip';
  }
};
