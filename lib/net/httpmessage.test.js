const HttpMessage = require('./httpmessage');

describe('httpmessage.test', function() {
  it('should create message', function() {
    const message = HttpMessage('http://localhost:81/foo/bar');
    expect(message.protocol).toEqual('http:');
    expect(message.port).toEqual('81');
    expect(message.hostname).toEqual('localhost');
    expect(message.pathname).toEqual('/foo/bar');
  });

  it('should use https by default', function() {
    const message = HttpMessage('localhost:81/foo/bar');

    expect(message.protocol).toEqual('https:');
    expect(message.port).toEqual('81');
    expect(message.hostname).toEqual('localhost');
    expect(message.pathname).toEqual('/foo/bar');
  });

  it('should sign', function() {
    const token = '12345';
    const sign = HttpMessage.sign(token);

    expect(sign.headers['Authorization']).toBeDefined();
  });

  it('should throw exception if user tries to proceed without token', function() {
    expect(() => {
      HttpMessage.sign('');
    }).toThrow();
  });
});
