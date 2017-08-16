module.exports.run = function() {
  var args = require('./lib/cli/parseargv')(process.argv);
  var config = {
    host: args.host || null,
    token: args.token || null
  };

  switch (args._[0]) {
    case 'list':
      require('./src/list')(config);
      return;
  }
};
