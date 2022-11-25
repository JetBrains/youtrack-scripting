/**
 * @param {*} it
 * @returns {string}
 */
function queryfields(it) {

  if (it === undefined) {
    return '';
  }

  if (typeof it === 'string') {
    return it;
  }

  if (Array.isArray(it)) {
    return it.map((i) => queryfields(i)).join(',');
  }

  if (it !== null && typeof it === 'object') {
    return queryfields(
      Object.keys(it).reduce((/**@type {string[]}*/result, /**@type {string}*/i) => {
        return result.concat(
          i + '(' + queryfields(it[i]) + ')'
        );
      }, [])
    );
  }

  return '';
}

module.exports = queryfields;
