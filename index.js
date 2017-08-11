module.exports.run = function() {
  var args = require('./lib/cli/parseargv')(process.argv);

  switch (args._[0]) {
    case 'list':
      printList();
      return;
  }


  function printList() {
    require('./src/workflowlist').query({
      host: require('url').resolve(args.host, '/api/admin/workflows'),
      token: args.token
    }, (error, data) => {
      if (!error) {
        data.forEach((x) => {
          print(x.name);
        })
      } else {
        print(error);
      }
    });


    function print() {
      console.log.apply(console, arguments);
    }
  }
};
