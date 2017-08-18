const fs = require('fs');
const resolve = require('url').resolve;
const net = require('../lib/net/index');
const tmpdir = require('../lib/fs/tmpdir');
const unzip = require('../lib/unzip/unzip');

const request = net.request;
const sign = net.sign;

function download(config, workflowName) {
  if (!workflowName) {
    throw new Error('Workflow id/name should be defined');
  }

  var options = sign(resolve(config.host, '/api/admin/workflows/' + workflowName), config.token);
  options.headers['Accept'] = 'application/zip';

  const req = request(options,
    (downloadError) => {
      if (downloadError) throw downloadError;
    }
  );

  req.on('response', reponse => {
    const zip = fs.createWriteStream(tmpdir(getZipName(workflowName)));

    reponse.pipe(zip).on('close', () => {
      unzip(zip.path, config.output);
    });
  });

  return req;

  function getZipName(workflowName) {
    return 'youtrack-workflow-' + workflowName + '.zip';
  }
}

module.exports = download;
