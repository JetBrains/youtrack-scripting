const fs = require('fs');
const exit = require('../../lib/cli/exit');
const resolve = require('../../lib/net/resolve');
const tmpdir = require('../../lib/fs/tmpdir');
const unzip = require('../../lib/fs/unzip');
const request = require('../../lib/net/request');
const i18n = require('../../lib/i18n/i18n');
const HttpMessage = require('../../lib/net/httpmessage');

function download(config, workflowName) {
  if (!workflowName) {
    exit(new Error(i18n('Workflow name should be defined')));
    return;
  }
  workflowName = workflowName.toString();
  var message = new HttpMessage(resolve(config.host, '/api/admin/workflows/' + workflowName.replace(/^@/, '')));
  message = config.token ? HttpMessage.sign(message, config.token) : message;
  message.headers['Accept'] = 'application/zip';

  const req = request(message,
    (downloadError) => {
      if (downloadError) exit(downloadError);
    }
  );

  req.on('response', response => {
    const zip = fs.createWriteStream(tmpdir(getZipName(workflowName)));
    const output = config.output || config.cwd;

    response.pipe(zip).on('close', () => {
      unzip(zip.path, require('path').resolve(output, workflowName), (error) => {
        if (error) return exit(error);

        console.log(i18n(`File extracted into '${output}'`));
      });
    });
  });

  return req;

  function getZipName(workflowName) {
    return 'youtrack-workflow-' + workflowName.split('/').pop() + '.zip';
  }
}

module.exports = download;
