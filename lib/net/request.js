const {http, https} = require('follow-redirects');
const HttpMessage = require('./httpmessage');

/**
 * @typedef {import('http').ClientRequest} ClientRequest
 */

/**
 * @param {string | URL} message
 * @param {{ method?: string; headers?: * }} options
 * @param {(error: (Error & {statusCode?: number})|null, data?: *) => void} fn
 * @returns ClientRequest
 */
function request(message, options, fn) {
  message = HttpMessage(message);
  const updatedOptions = updateOptions(options);

  const netProvider = message.protocol === 'http:' ? http : https;
  const req = netProvider.request(message, updatedOptions, onResponse);

  req.on('error', (error) => {
    fn && fn(error, null);
  });

  return closeMaybe(/**@type ClientRequest */(req), updatedOptions);

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
 * @param {{ method: string; headers: {} }} options
 * @returns ClientRequest
 */
function closeMaybe(req, options) {
  if (options.method === 'GET') req.end();
  return req;
}

/**
 * @param {{ method?: string; headers?: *}} options
 */
function updateOptions(options) {

  return {
    method: options?.method ?? 'GET',
    headers: {
      'User-Agent': options?.headers?.['User-Agent'] ??
        [`Nodejs/${process.versions.node}`,
          `YouTrackCLI/${require('../../package.json').version}`].join(' '),
      ...options.headers
    }
  };
}

module.exports = request;
