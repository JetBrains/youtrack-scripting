const fs = require('fs');
const resolve = require('url').resolve;
const tmpdir = require('../lib/fs/tmpdir');
const unzip = require('../lib/unzip/unzip');
const request = require('../lib/net/request');
const HttpMessage = require('../lib/net/httpmessage');

function download(config, workflowName) {
  if (!workflowName) {
    throw new Error('Workflow name should be defined');
  }

  var message = new HttpMessage(resolve(config.host, '/api/admin/workflows/' + workflowName));
  message = config.token ? HttpMessage.sign(message, config.token) : message;
  message.headers['Accept'] = 'application/zip';

  const req = request(message,
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
