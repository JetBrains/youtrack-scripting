function request(url, fn) {
  var http = require('http');
  var https = require('https');
  var options = require('url').parse(url);

  var netProvider = options.protocol === 'https:' ? https : http;

  var qs = require('querystring');
  if (options.query) {
    options.path += '?' + qs.stringify(options.query);
  }

  options.method = options.method || 'GET';

  options.headers = options.headers || {};
  options.headers['User-Agent'] = 'Nodejs/' + process.version + ' YouTrackWorkflowCLI/0.0';

  var req = netProvider.request(options, function(res) {
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
        error = new Error(res.statusCode + ' ' + res.statusMessage);
        error.statusCode = res.statusCode;
        error.data = data;
      }

      fn && fn(error, data, res);
    });

    res.on('error', (error) => {
      fn && fn(error, data, res);
    });
  });

  req.on('error', (error) => {
    fn && fn(error, null, req);
  });

  if (options.method === 'GET') {
    req.end();
  }

  return req;
}

function sign(url, token) {
  var options = require('url').parse(url);
  options.headers = options.headers || {};
  options.headers['Authorization'] = 'Bearer ' + token;
  return options;
}

function formatFields(it) {
  const u = require('util');

  if (u.isUndefined(it)) {
    return '';
  }

  if (u.isString(it)) {
    return it;
  }

  if (u.isArray(it)) {
    return it.map((i) => formatFields(i)).join(',');
  }

  if (u.isObject(it)) {
    return formatFields(
      Object.keys(it).reduce((result, i) => {
        return result.concat(
          i + '(' + formatFields(it[i]) + ')'
        );
      }, [])
    );
  }
}

function addFields(url, fields) {
  var options = require('url').parse(url);
  var fieldstr = formatFields(fields);

  options.query = options.query || {};
  options.query.fields = fieldstr;
  return options;
}


module.exports.request = request;
module.exports.sign = sign;
module.exports.addFields = addFields;
