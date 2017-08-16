const fs = require('fs');
const resolve = require('url').resolve;
const net = require('../lib/net/index');
const tmpdir = require('../lib/fs/tmpdir');

const request = net.request;
const sign = net.sign;

module.exports = function(config, workflowName) {
  if (!workflowName) throw new Error('Workflow name should be defined');

  const req = request(sign(resolve(config.host, '/rest/workflow/distributive/' + workflowName), config.token),
    (error) => {
      if (error) throw error;
    }
  );

  req.on('response', (res) => {
    const zip = fs.createWriteStream(tmpdir(getZipName(workflowName)));
    res.pipe(zip);
  });

  return req;

  function getZipName(workflowName) {
    return 'youtrack-workflow-' + workflowName + '-' + Date.now() + '.zip';
  }
};
