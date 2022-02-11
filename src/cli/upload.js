const resolve = require('../../lib/net/resolve');
const fs = require('fs');
const path = require('path');
const exit = require('../../lib/cli/exit');
const request = require('../../lib/net/request');
const zipfolder = require('../../lib/fs/zipfolder');
const tmpdir = require('../../lib/fs/tmpdir');
const i18n = require('../../lib/i18n/i18n');
const HttpMessage = require('../../lib/net/httpmessage');

/**
 * @param {*} config 
 * @param {string} workflowDir 
 * @returns 
 */
module.exports = function(config, workflowDir) {
  if (!workflowDir) {
    exit(new Error(i18n('Workflow directory should be defined')));
    return;
  }

  var zipPath = tmpdir(generateZipName(workflowDir));

  var workflowName = path.basename(workflowDir);
  var pkgPath = path.resolve(workflowDir, 'manifest.json');
  if (fs.existsSync(pkgPath)) {
    workflowName = require(pkgPath).name;
  } else {
    var obsoletePkgPath = path.resolve(workflowDir, 'package.json');
    if (fs.existsSync(obsoletePkgPath)) {
      workflowName = require(obsoletePkgPath).name;
    }
  }

  zipfolder(path.resolve(config.cwd, workflowDir), zipPath, (error, zip) => {
    if (error) {
      return exit(error);
    }

    return updateWorkflow();

    /**
     * @param {boolean} [isCreate]
     * @returns {import('http').ClientRequest}
     */
    function updateWorkflow(isCreate) {
      var content = JSON.stringify({
        name: isCreate ? workflowName : undefined,
        base64Content: fs.readFileSync(zip.path).toString('base64')
      });

      var message = HttpMessage(resolve(config.host, '/api/admin/workflows/' + (isCreate ? '' : encodeURIComponent(workflowName))));
      message.method = 'POST';
      message = config.token ? HttpMessage.sign(message, config.token) : message;
      message.headers['Content-Type'] = 'application/json';
      message.headers['Content-Length'] = String(content.length);

      var req = request(message, (error) => {
        if (error && error.statusCode === 404 && !isCreate) { // Try create new workflow
          return updateWorkflow(true);
        }

        if (error) {
          return exit(error);
        }

        if (isCreate) {
          console.log(i18n('Workflow "' + workflowName + '" created'));
        } else {
          console.log(i18n('Workflow "' + workflowName + '" uploaded'));
        }
      });

      req.write(content);
      req.end();
      return req;
    }
  });

  /**
   * @param {string} workflowDir 
   * @returns {string}
   */
  function generateZipName(workflowDir) {
    return 'youtrack-workflow-' + path.basename(workflowDir) + '.zip';
  }
};
