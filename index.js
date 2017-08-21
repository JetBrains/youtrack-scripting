module.exports.run = function() {
  const args = require('./lib/cli/parseargv')(process.argv);
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
        require('./src/cli/' + args._[0])(config, args._.pop());
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
    printLine('list     --host [--token]     ', 'List of installed workflows');
    printLine('download <workflow> [--output]', 'Download a workflow');
    printLine('upload   <directory>          ', 'Upload workflow to the server');
    br();

    function br() {
      console.log('');
    }

    function printLine(option, description) {
      console.log('    ' + option + '   ' + description);
    }
  }

  function checkRequiredParams(required, args, fn) {
    var exit = require('./lib/cli/exit');

    required.forEach((param) => {
      if (args.hasOwnProperty(param)) return;
      exit(new Error('Option "--' + param + '" is required'));
    });

    return fn();
  }

  function printVersion() {
    console.log(require('./package.json').version);
  }
};
