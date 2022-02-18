const i18n = require('../i18n/i18n');

/**
 * @param {(Error & {statusCode?: number})|null} message 
 * @returns {boolean}
 */
module.exports = (message) => {
  if (message instanceof Error) {
    if (message.statusCode === 302) {
      console.error(i18n('Please check your host parameter. Probably you have missed context, or used http instead of https'));
    }
    console.error(message.toString());
  }
  return process.exit(1);
};
