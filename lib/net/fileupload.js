var path = require('path');
var fs = require('fs');

var net = require('./index');
var request = net.request;

module.exports = function(options, filePath, fn) {
  var filename = path.basename(filePath);
  var dataSize = fs.statSync(filePath).size;

  var boundary = '----NodeFormBoundary';
  var LINE_BREAK = '\r\n';
  var formDataHeader = [
    ('--' + boundary + LINE_BREAK),
    ('Content-Disposition: form-data; name="file"; filename="' + filename + '"' + LINE_BREAK),
    ('Content-Type: application/zip' + LINE_BREAK + LINE_BREAK)
  ].join('');
  var formDataFooter = LINE_BREAK + '--' + boundary + '--' + LINE_BREAK;

  options.method = 'POST';
  options.headers['Content-Type'] = 'multipart/form-data; boundary=' + boundary;
  options.headers['Content-Length'] = dataSize + formDataHeader.length + formDataFooter.length;

  var req = request(options, fn);
  req.write(formDataHeader);

  fs.createReadStream(filePath).on('data', (chunk) => {
    req.write(chunk);
  }).on('end', () => {
    req.write(formDataFooter);
    req.end();
  });
};
