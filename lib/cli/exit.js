/**
 * @param {(Error & {statusCode?: number})|null} message
 * @returns {boolean}
 */
module.exports = (message) => {
  if (message instanceof Error) {
    console.error(message.toString());
  }
  return process.exit(1);
};
