const nock = require('nock');
const request = require('./request');
const HttpMessage = require('./httpmessage');

nock.back.setMode('record');

describe('request.test', function() {
  beforeEach(function() {
    nock.disableNetConnect();
  });

  it('should send http request', function(done) {
    nock('http://localhost:80').get('/foo').reply(200, response({}));

    request('http://localhost:80/foo', done);
  });

  it('should send https request', function(done) {
    nock('https://localhost:80').get('/foo').reply(200, response({}));

    request('https://localhost:80/foo', done);
  });

  it('should pass response in callback', function(done) {
    nock('https://localhost:80').get('/foo').reply(200, response({}));

    request('https://localhost:80/foo', (error, response) => {
      expect(error).toEqual(null);
      expect(response).toBeDefined();
      done();
    });
  });


  it('should return parsed json data', function(done) {
    nock('https://localhost:80').get('/foo').reply(200, response({
      foo: 'foo'
    }), {
      'Content-Type': 'application/json'
    });

    request('https://localhost:80/foo', (error, response) => {
      expect(response.foo).toEqual('foo');
      done();
    });
  });

  it('should pass error to handler', function(done) {
    nock('https://localhost:80').get('/foo').reply(500, response({}));

    request('https://localhost:80/foo', (error) => {
      expect(error).toBeDefined();
      done();
    });
  });

  it('should parse error response', function(done) {
    nock('https://localhost:80').get('/foo').reply(500, response({
      foo: 'foo'
    }), {
      'Content-Type': 'application/json'
    });

    request('https://localhost:80/foo', (error, response) => {
      expect(error).toBeDefined();
      expect(response.foo).toEqual('foo');
      done();
    });
  });

  it('should pass query parameters', function(done) {
    const message = HttpMessage('https://localhost:80/foo');
    message.query = {};
    message.query.fields = 'foo';
    nock('https://localhost:80').get('/foo').query({
      fields: 'foo'
    }).reply(200, response({}));

    request(message, done);
  });

  /**
   * @param {*} data 
   * @returns {string}
   */
  function response(data) {
    return JSON.stringify(data);
  }
});
