const i18n = require('../../lib/i18n/i18n');

module.exports.run = function(argv = process.argv) {
  const args = require('../../lib/cli/parseargv')(argv);
  const config = {
    host: args.host || null,
    token: args.token || null,
    output: args.output || null,
    cwd: process.cwd()
  };

  if (args.version || args.v) {
    return printVersion();
  }

  switch (args._[0]) {
    case 'list':
    case 'download':
    case 'upload':
      checkRequiredParams(['host'], args, () => {
        require('./' + args._[0])(config, args._.slice(1)[0]);
      });
      return;
    case 'version':
      printVersion();
      return;
    default:
      printHelp();
      return;
  }

  function printHelp() {
    br();
    printLine(i18n('list     --host [--token]     '), i18n('View a list of installed workflows'));
    printLine(i18n('download <workflow> [--output]'), i18n('Download a workflow'));
    printLine(i18n('upload   <directory>          '), i18n('Upload workflow to server'));
    br();

    function br() {
      console.log('');
    }

    /**
     * @param {string} option 
     * @param {string} description 
     */
    function printLine(option, description) {
      console.log('    ' + option + '   ' + description);
    }
  }

  /**
   * @param {string[]} required 
   * @param {Object<string,*>} args 
   * @param {*} fn 
   * @returns {void}
   */
  function checkRequiredParams(required, args, fn) {
    const exit = require('../../lib/cli/exit');

    if (required.some((param) => {
      if (args.hasOwnProperty(param) && args[param]) return;
      return exit(new Error(i18n('Option "--' + param + '" is required')));
    })) return;

    return fn();
  }

  function printVersion() {
    console.log(require('../../package.json').version);
  }
};
