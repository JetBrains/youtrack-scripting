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

  const zipPath = tmpdir(generateZipName(workflowDir));

  let workflowName = path.basename(workflowDir);
  const pkgPath = path.resolve(workflowDir, 'manifest.json');
  if (fs.existsSync(pkgPath)) {
    workflowName = require(pkgPath).name;
  } else {
    const obsoletePkgPath = path.resolve(workflowDir, 'package.json');
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
      const content = JSON.stringify({
        name: isCreate ? workflowName : undefined,
        base64Content: fs.readFileSync(zip.path).toString('base64')
      });

      let message = HttpMessage(resolve(config.host, '/api/admin/workflows/' + (isCreate ? '' : encodeURIComponent(workflowName))));
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': String(content.length)
        }
      };

      if (config.token) {
        const signHeaders = HttpMessage.sign(config.token);
        options.headers = {...options.headers, ...signHeaders.headers};
      }

      const req = request(message, options, (error) => {
        if (error && error.statusCode === 404 && !isCreate) { // Try to create new workflow
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
