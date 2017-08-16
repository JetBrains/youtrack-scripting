module.exports.run = function() {
  var args = require('./lib/cli/parseargv')(process.argv);
  var config = {
    host: args.host || null,
    token: args.token || null,
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
  }
};
