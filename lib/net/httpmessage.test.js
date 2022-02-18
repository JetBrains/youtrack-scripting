const HttpMessage = require('./httpmessage');

describe('httpmessage.test', function() {
  it('should create message', function() {
    const message = HttpMessage('http://localhost:80/foo/bar');

    expect(message.protocol).toEqual('http:');
    expect(message.port).toEqual('80');
    expect(message.hostname).toEqual('localhost');
    expect(message.path).toEqual('/foo/bar');
  });

  it('should use http by default', function() {
    const message = HttpMessage('localhost:80/foo/bar');

    expect(message.protocol).toEqual('http:');
    expect(message.port).toEqual('80');
    expect(message.hostname).toEqual('localhost');
    expect(message.path).toEqual('/foo/bar');
  });

  it('should sign message', function() {
    const message = HttpMessage('http://localhost:80');
    const token = '12345';
    const signedMessage = HttpMessage.sign(message, token);

    expect(signedMessage.headers['Authorization']).toBeDefined();
  });

  it('should throw exception if user tries to sign message without token', function() {
    const message = HttpMessage('http://localhost:80');
    expect(() => {
      HttpMessage.sign(message, '');
    }).toThrow();
  });
});
