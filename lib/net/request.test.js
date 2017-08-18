var expect = require('expect');
var nock = require('nock');
var request = require('./request');
var HttpMessage = require('./httpmessage');

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
      expect(response).toExist();
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
      expect(error).toExist();
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
      expect(error).toExist();
      expect(response.foo).toEqual('foo');
      done();
    });
  });

  it('should pass query parameters', function(done) {
    var message = new HttpMessage('https://localhost:80/foo');
    message.query = {};
    message.query.fields = 'foo';
    nock('https://localhost:80').get('/foo').query({
      fields: 'foo'
    }).reply(200, response({}));

    request(message, done);
  });

  function response(data) {
    return JSON.stringify(data);
  }
});
