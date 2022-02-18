const http = require('http');
const https = require('https');
const qs = require('querystring');
const HttpMessage = require('./httpmessage');

/**
 * @param {import('./httpmessage').Message|string} message 
 * @param {(error: (Error & {statusCode?: number})|null, data?: *) => void} fn 
 * @returns {http.ClientRequest}
 */
function request(message, fn) {
  message = normalizeMessage(message);

  const netProvider = message.protocol === 'https:' ? https : http;
  const req = netProvider.request(message, onResponse);

  req.on('error', (error) => {
    fn && fn(error, null);
  });

  return closeMaybe(req, message);

  /**
   * @param {import('http').IncomingMessage} res 
   */
  function onResponse(res) {
    /**@type {*}*/
    let data = '';
    /**@type {(Error & {statusCode?: number, data?: *})|null}*/
    let error = null;

    res.on('data', (chunk) => {
      data += chunk.toString();
    });

    res.on('end', function() {
      const contentType = res.headers['content-type'] || '';

      if (contentType.indexOf('application/json') > -1) {
        data = JSON.parse(data);
      }

      if (res.statusCode && (res.statusCode < 200 || res.statusCode > 299)) {
        const errorDesc = data.error_description || '';
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

/**
 * @param {import('http').ClientRequest} req 
 * @param {import('./httpmessage').Message} message 
 * @returns {import('http').ClientRequest}
 */
function closeMaybe(req, message) {
  if (message.method === 'GET') req.end();
  return req;
}

/**
 * @param {import('./httpmessage').Message|string} message 
 * @returns {import('./httpmessage').Message}
 */
function normalizeMessage(message) {
  message = HttpMessage(message);
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
