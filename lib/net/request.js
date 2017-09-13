var http = require('http');
var https = require('https');
var qs = require('querystring');
var HttpMessage = require('./httpmessage');

function request(message, fn) {
  message = normalizeMessage(message);

  var netProvider = message.protocol === 'https:' ? https : http;
  var req = netProvider.request(message, onResponse);

  req.on('error', (error) => {
    fn && fn(error, null);
  });

  return closeMaybe(req, message);

  function onResponse(res) {
    var data = '';
    var error = null;

    res.on('data', (chunk) => {
      data += chunk.toString();
    });

    res.on('end', function() {
      var contentType = res.headers['content-type'] || '';

      if (contentType.indexOf('application/json') > -1) {
        data = JSON.parse(data);
      }

      if (res.statusCode < 200 || res.statusCode > 299) {
        var errorDesc = data.error_description || '';
        error = new Error('[' + res.statusCode + '] ' + (errorDesc || res.statusMessage));
        error.statusCode = res.statusCode;
        error.data = data;
      }

      fn && fn(error, data);
    });

    res.on('error', (error) => {
      fn && fn(error, data);
    });
  }
}

function closeMaybe(req, message) {
  if (message.method === 'GET') req.end();
  return req;
}

function normalizeMessage(message) {
  message = new HttpMessage(message);
  if (message.query) message.path += '?' + qs.stringify(message.query);
  message.method = message.method || 'GET';
  message.headers['User-Agent'] = (
    message.headers['User-Agent'] || [
      'Nodejs/' + process.versions.node,
      'YouTrackCLI/' + require('../../package.json').version
    ].join(' ')
  );
  return message;
}

module.exports = request;
