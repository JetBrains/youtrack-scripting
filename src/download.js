const fs = require('fs');
const exit = require('../lib/cli/exit');
const resolve = require('url').resolve;
const tmpdir = require('../lib/fs/tmpdir');
const unzip = require('../lib/fs/unzip');
const request = require('../lib/net/request');
const HttpMessage = require('../lib/net/httpmessage');

function download(config, workflowName) {
  if (!workflowName) {
    exit(new Error('Workflow name should be defined'));
    return;
  }

  var message = new HttpMessage(resolve(config.host, '/api/admin/workflows/' + workflowName.replace(/^@/, '')));
  message = config.token ? HttpMessage.sign(message, config.token) : message;
  message.headers['Accept'] = 'application/zip';

  const req = request(message,
    (downloadError) => {
      if (downloadError) exit(downloadError);
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
