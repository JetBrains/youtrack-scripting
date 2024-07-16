const resolve = require('../../lib/net/resolve');
const fs = require('fs');
const path = require('path');
const exit = require('../../lib/cli/exit');
const request = require('../../lib/net/request');
const zipfolder = require('../../lib/fs/zipfolder');
const tmpdir = require('../../lib/fs/tmpdir');
const i18n = require('../../lib/i18n/i18n');
const HttpMessage = require('../../lib/net/httpmessage');
const FormData = require('form-data');
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
      const form = new FormData();
      form.append('file', fs.createReadStream(zip.path), {filename:workflowName + '.zip'});

      let message = HttpMessage(resolve(config.host, '/api/admin/workflows/import' + (isCreate ? '' : encodeURIComponent(workflowName))));
      const options = {
        method: 'POST',
        headers: form.getHeaders()
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

      form.pipe(req);
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
