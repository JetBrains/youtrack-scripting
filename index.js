module.exports.run = function() {
  const args = require('./lib/cli/parseargv')(process.argv);
  const config = {
    host: args.host || null,
    token: args.token || null,
    output: args.output || null,
    cwd: process.cwd()
  };

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
    default:
      printHelp();
      return;
  }

  function printHelp() {
    br();
    printTitle('Commands');
    printLine('list      ', 'List of installed workflows');
    printLine('download  ', 'Download a workflow');
    printLine('upload    ', 'Upload workflow to the server');
    br();
    printTitle('Options');
    printLine('--host    ', 'YouTrack host');
    printLine('--token   ', 'Authorization token');
    printLine('--output   ', 'Target folder');
    br();
    br();

    function printTitle(title) {
      console.log('  ' + title + ':');
    }

    function br() {
      console.log('');
    }

    function printLine(option, description) {
      console.log('    ' + option + '   ' + description);
    }
  }
};
