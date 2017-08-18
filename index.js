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
      require('./src/list')(config);
      return;
    case 'download':
      require('./src/download')(config, args._.pop());
      return;
    case 'upload':
      require('./src/upload')(config, args._.pop());
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

  function printVersion() {
    console.log(require('./package.json').version);
  }
};
