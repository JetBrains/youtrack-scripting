var expect = require('expect');
var HttpMessage = require('./httpmessage');

describe('httpmessage.test', function() {
  it('should create message', function() {
    var message = new HttpMessage('http://localhost:80/foo/bar');

    expect(message.protocol).toEqual('http:');
    expect(message.port).toEqual('80');
    expect(message.hostname).toEqual('localhost');
    expect(message.path).toEqual('/foo/bar');
  });

  it('should use http by default', function() {
    var message = new HttpMessage('localhost:80/foo/bar');

    expect(message.protocol).toEqual('http:');
    expect(message.port).toEqual('80');
    expect(message.hostname).toEqual('localhost');
    expect(message.path).toEqual('/foo/bar');
  });

  it('should sign message', function() {
    var message = new HttpMessage('http://localhost:80');
    var token = '12345';
    var signedMessage = HttpMessage.sign(message, token);

    expect(signedMessage.headers['Authorization']).toExist();
  });

  it('should throw exception if user tries to sign message without token', function() {
    var message = new HttpMessage('http://localhost:80');
    expect(() => {
      HttpMessage.sign(message);
    }).toThrow();
  });
});
